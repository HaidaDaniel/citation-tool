const axios = require('axios');
const knex = require('../knex');

const createSearchTasks = async (req, res) => {
  const {  name, address, phone, website, type } = req.body;
  const language_code = "en";
  const location_code = 2840;
  const userId = req.user.userId;
  const os = "windows";
  const device = "desktop";
  const depth = 100;

  try {

    const tasks = type.map((t) => {
      let keyword;
      switch (t) {
        case "name":
          keyword = name;
          break;
        case "nameAddress":
          keyword = `${name} ${address}`;
          break;
        case "namePhone":
          keyword = `${name} ${phone}`;
          break;
        case "nameWebsite":
          keyword = `${name} ${website}`;
          break;
        case "nameAddressPhone":
          keyword = `${name} ${address} ${phone}`;
          break;
        default:
          throw new Error(`Unknown type of keyword: ${t}`);
      }

      const pingback_url = `${process.env.SERVER_URL}/ping/pingback?id=$id`;
      return {
        keyword,
        language_code,
        os,
        device,
        type: t,
        depth,
        ...(address ? { location_name: address } : { location_code }),
        pingback_url,
      };
    });

    const response = await axios.post(
      'https://api.dataforseo.com/v3/serp/google/organic/task_post',
      tasks,
      {
        auth: {
          username: process.env.DATAFORSEO_EMAIL,
          password: process.env.DATAFORSEO_PASSWORD,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const createdTasks = response.data.tasks.map((task, index) => ({
      task_id: task.id,
      user_id: userId,
      keyword: tasks[index].keyword,
      keyword_type: tasks[index].type,
      status: 'pending',
    }));

    console.log("Tasks created successfully:", createdTasks);
    await knex('tasks').insert(createdTasks);

    res.status(200).json({
      message: "Tasks created successfully",
      taskIds: createdTasks.map((t) => t.task_id),
    });
  } catch (error) {
    console.error("Error creating tasks:", error.message);
    res.status(500).json({
      message: "Error creating tasks",
      error: error.message,
    });
  }
};


const checkTasksStatus = async (req, res) => {
  const taskIds = req.query.taskIds.split(",");

  try {

    const response = await axios.get(
      'https://api.dataforseo.com/v3/serp/google/organic/tasks_ready',
      {
        auth: {
          username: process.env.DATAFORSEO_EMAIL,
          password: process.env.DATAFORSEO_PASSWORD,
        },
      }
    );

    const readyTaskIds = response['data']['tasks'][0]['result'].map((task) => task.id);

    const completedTaskIds = taskIds.filter((taskId) =>
      readyTaskIds.includes(taskId)
    );
    console.log("completedTaskIds:", completedTaskIds);

    if (completedTaskIds.length !== taskIds.length) {
      return res.status(200).json({
        message: "Tasks are still in progress",
        status: "pending",
        completedTaskIds,
      });
    }


    const results = await Promise.all(
      completedTaskIds.map(async (taskId) => {
        const resultResponse = await axios.get(
          `https://api.dataforseo.com/v3/serp/google/organic/task_get/regular/${taskId}`,
          {
            auth: {
              username: process.env.DATAFORSEO_EMAIL,
              password: process.env.DATAFORSEO_PASSWORD,
            },
          }
        );
        return {
          task_id: taskId,
          result: resultResponse.data,
        };
      })
    );

    res.status(200).json({
      message: "All tasks completed",
      status: "ready",
      results,
    });
  } catch (error) {
    console.error("Error cheking status of tasks", error.message);
    res.status(500).json({
      message: "Error cheking status of tasks",
      error: error.message,
    });
  }
};

module.exports = {
  createSearchTasks,
  checkTasksStatus,
};
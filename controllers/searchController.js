const axios = require('axios');


const createSearchTasks = async (req, res) => {
  const { name, address, phone, website, type } = req.body;
  const language_code = "en";
  const location_code = 2840; // US code
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
      return {
        keyword,
        language_code,
        os,
        device,
        depth,
        ...(address ? { location_name: address } : { location_code })
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


    const taskIds = response.data.tasks.map(task => task.id);
    console.log("taskIds:", taskIds);
    res.status(200).json({
      message: "Tasks created successfully",
      taskIds,
    });
  } catch (error) {
    console.error("Error creating task:", error.message);
    res.status(500).json({
      message: "Error creating task",
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
    console.log("readyTaskIds:", readyTaskIds);
    console.log("taskIds: 2nd", taskIds);
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
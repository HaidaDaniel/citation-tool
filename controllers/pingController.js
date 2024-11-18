const axios = require("axios");
const knex = require("../knex"); // For database interaction
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const handlePing = async (req, res) => {
  const { id: taskId } = req.query;

  try {
    console.log(`Ping received for task ID: ${taskId}`);

    // Fetch task result from the API
    const response = await axios.get(
      `https://api.dataforseo.com/v3/serp/google/organic/task_get/regular/${taskId}`,
      {
        auth: {
          username: process.env.DATAFORSEO_EMAIL,
          password: process.env.DATAFORSEO_PASSWORD,
        },
      }
    );

    const taskData = response.data.tasks[0];
    const result = taskData.result[0];
    if (!result) {
      throw new Error("No result found for the task.");
    }

    const keyword = taskData.data.keyword;
    const checkUrl = result.check_url;
    const items = result.items || [];
    const urlCount = result.items_count;
    const date = result.datetime;

    // Save task result to the database and generate Excel file
    const excelFilePath = await saveResultToDBAndCreateExcel({
      taskId,
      keyword,
      checkUrl,
      urlCount,
      items,
      date,
    });

    console.log(`Result saved and Excel created for task ID: ${taskId}`);
    res
      .status(200)
      .json({ message: "Task processed successfully", excelFilePath });
  } catch (error) {
    console.error(`Error processing task ${taskId}:`, error.message);
    res
      .status(500)
      .json({ message: "Failed to process task", error: error.message });
  }
};

// Save results to DB and generate Excel
const saveResultToDBAndCreateExcel = async ({
  taskId,
  checkUrl,
  urlCount,
  items,
  date,
  keyword,
}) => {
  const formattedData = {
    date: date,
    keyword: keyword,
    links: items.map((item) => ({
      url: item.url,
    })),
  };
  const excelRows = items.map((item) => ({
    Date: date,
    Keyword: keyword,
    URL: item.url,
  }));

  // Save task details and result data into the `tasks` table
  await knex("tasks")
    .where({ task_id: taskId })
    .update({
      status: "ready",
      check_url: checkUrl,
      url_qty: urlCount,
      result_data: JSON.stringify(formattedData),
      updated_at: new Date(),
    });

  // Generate Excel file
  const worksheet = xlsx.utils.json_to_sheet(excelRows);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Results");

  const filePath = path.join(__dirname, `../exports/results_${taskId}.xlsx`);
  xlsx.writeFile(workbook, filePath);

  // Update tasks table with Excel file path
  await knex("tasks").where({ task_id: taskId }).update({
    excel_file_path: filePath,
  });

  return filePath;
};

module.exports = { handlePing };

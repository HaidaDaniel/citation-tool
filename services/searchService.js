const axios = require('axios');

const BASE_URL = 'https://api.dataforseo.com/v3/serp/google/organic';

const searchService = {
  async createSearchTask(post_array) {
    console.log(post_array)
    try {
      const response = await axios({
        method: 'post',
        url: `${BASE_URL}/task_post`,
        auth: {
          username: process.env.DFS_API_USERNAME,
          password: process.env.DFS_API_PASSWORD 
        },
        data: post_array,
        headers: {
          'content-type': 'application/json'
        }
      });

      const result = response.tasks;
      console.log(response)
 
      return result;
    } catch (error) {
      console.error("Error creating search task", error.response?.data || error.message);
      throw new Error("Failed to create search task");
    }
  },

  async checkTaskStatus(taskId) {
    try {
      const response = await axios.get(`${BASE_URL}/task_get/regular/${taskId}`, {
        auth: {
          username: process.env.DFS_API_USERNAME,
          password: process.env.DFS_API_PASSWORD 
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error checking task status: ${error.message}`);
      throw new Error("Failed to check task status");
    }
  },

  async getTaskResults(taskId) {
    try {
      const response = await axios.get(`${BASE_URL}/task_get/html/${taskId}`, {
        auth: {
          username: process.env.DFS_API_USERNAME,
          password: process.env.DFS_API_PASSWORD 
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error getting task results: ${error.message}`);
      throw new Error("Failed to get task results");
    }
  }
};

module.exports = searchService;
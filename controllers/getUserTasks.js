const knex = require('../knex'); // Import knex for database interaction

// Controller to fetch all tasks for a user
const getUserTasks = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract userId from the request object (auth middleware)
    
    // Query to fetch tasks for the user
    const tasks = await knex('tasks')
      .where({ user_id: userId })
      .select(
        'task_id',
        'keyword',
        'keyword_type',
        'status',
        'check_url',
        'url_qty',
        'excel_file_path',
        'created_at',
        'updated_at'
      )
      .orderBy('created_at', 'desc'); // Order tasks by creation date, newest first

    res.status(200).json({
      message: 'Tasks fetched successfully',
      tasks,
    });
  } catch (error) {
    console.error('Error fetching user tasks:', error.message);
    res.status(500).json({
      message: 'Failed to fetch tasks',
      error: error.message,
    });
  }
};

module.exports = { getUserTasks };

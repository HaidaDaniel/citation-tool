const searchService = require('../services/searchService');
const knex = require('../knex');

exports.createSearchTask = async (req, res) => {
  try {
    const { body } = req.body;
    const taskId = await searchService.createSearchTask(body);
    console.log(res)
    res.status(202).json({ taskId, message: 'Search task created successfully. Check status for completion.' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating search task', error });
  }
};

exports.checkTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const status = await searchService.checkTaskStatus(taskId);
    res.status(200).json({ tasks, status });
  } catch (error) {
    res.status(500).json({ message: 'Error checking task status', error });
  }
};

exports.getSearchResults = async (req, res) => {
  try {
    const { taskId } = req.params;
    const results = await searchService.getTaskResults(taskId);

    const userId = req.user.userId;
    const userCredits = await knex('credits').where({ user_id: userId }).first();
    if (userCredits.balance <= 0) {
      return res.status(403).json({ message: 'Insufficient credits' });
    }
    await knex('credits').where({ user_id: userId }).update({
      balance: userCredits.balance - results.length
    });
    await knex('search_logs').insert({
      user_id: userId,
      search_term: JSON.stringify({ business_name, address, phone }),
      credits_used: results.length,
      searched_at: new Date(),
    });

    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching search results', error });
  }
};
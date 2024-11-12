const knex = require('../knex');
const axios = require('axios');

exports.search = async (req, res) => {
  try {
    const { business_name, address, phone } = req.body;
    const userId = req.user.userId;

    // const userCredits = await knex('credits').where({ user_id: userId }).first();
    // console.log(userCredits);
    // if (!userCredits || userCredits.balance === 0) {
    //   return res.status(403).json({ message: 'Insufficient credits', credits: userCredits ? userCredits.balance : 0 });
    // }

    const credentials = Buffer.from(`${process.env.DATAFORSEO_EMAIL}:${process.env.DATAFORSEO_PASSWORD}`).toString('base64');

    const params = {
      business_name,
      address,
      phone,
    };

    const response = await axios.get('https://app.dataforseo.com/v3/path/to/endpoint', {
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
      params,
    });

    const results = response.data;

    // Списание кредитов
    // await knex('credits').where({ user_id: userId }).update({
    //   balance: userCredits.balance - 1,
    // });

    // Логирование запроса
    await knex('search_logs').insert({
      user_id: userId,
      search_term: JSON.stringify(params),
      credits_used: 1,
      searched_at: new Date(),
    });

    res.status(200).json({ results });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ message: 'Error performing search', error: error.response ? error.response.data : error.message });
  }
};
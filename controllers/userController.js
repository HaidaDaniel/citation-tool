const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../knex');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await knex('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [userId] = await knex('users').insert({
      username,
      email,
      password: hashedPassword,
    }).returning('id');

    await knex('credits').insert({
      user_id: userId,
      balance: 1000,
    });

    res.status(201).json({ userId, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await knex('users').where({ email }).first();
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, message: 'Logged in successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await knex('users').where({ id: req.user.userId }).first();
    const credit = await knex('credits').where({ user_id: req.user.userId }).first();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ id: user.id, username: user.username, email: user.email ,  credit: credit ? credit.balance : 0});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error });
  }
};

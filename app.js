const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const knex = require('./knex');
require('dotenv').config();
const axios = require('axios');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const searchRouter = require('./routes/search');

const userRouter = require("./routes/user");
const pingRouter = require("./routes/ping");
const downloadRouter = require("./routes/download");


const app = express();
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};

app.use(cors(corsOptions));
app.set("trust proxy", true);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/users', usersRouter);
app.use('/search', searchRouter);
app.use("/ping", pingRouter);
app.use("/files", downloadRouter);
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Server is working!' });
});

async function waitForDatabaseConnection(retries = 10, delay = 1000) {
    while (retries) {
      try {
        await knex.raw('SELECT 1');
        console.log('Database connection established');
        return true;
      } catch (err) {
        console.log(`Database connection failed. Retrying in ${delay / 1000} seconds...`);
        retries -= 1;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error('Could not connect to the database');
  }
  async function fetchNgrokUrl(retries = 5, delay = 10000) {
    const NGROK_API_URL = 'http://ngrok:4040/api/tunnels';
  
    while (retries > 0) {
      try {
        const response = await axios.get(NGROK_API_URL);
        console.log('ngrok response:', response.data);
        const tunnels = response.data.tunnels || [];
        if (tunnels.length > 0) {
          const ngrokUrl = tunnels[0].public_url;
  
          const envPath = path.resolve(__dirname, '.env');
          fs.appendFileSync(envPath, `\nSERVER_URL=${ngrokUrl}\n`);
          console.log(`SERVER_URL updated to ${ngrokUrl}`);
          require('dotenv').config({ path: envPath });
          process.env.SERVER_URL = ngrokUrl;
          return;
        }
      } catch (error) {
        console.error('Error fetching ngrok URL:', error.message);
      }
  
      retries--;
      if (retries > 0) {
        console.log(`Retrying to fetch ngrok URL in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  
    console.error('Failed to fetch ngrok URL after retries.');
  }

  async function checkServerUrl() {
    const serverUrl = process.env.SERVER_URL;
    if (!serverUrl) {
      console.error('SERVER_URL is not defined in the environment variables.');
      return;
    }
  
    try {
      const response = await axios.get(`${serverUrl}/test`);
      if (response.status === 200 && response.data.message === 'Server is working!') {
        console.log(`Server URL is correct & working: ${serverUrl}`);
      } else {
        console.error(`Server URL is not responding as expected: ${serverUrl}`);
      }
    } catch (error) {
      console.error(`Error checking SERVER_URL: ${error.message}`);
    }
  }
  
  waitForDatabaseConnection()
    .then(() => knex.migrate.latest())
    .then(() => console.log('Migrations are up to date'))
    .then(fetchNgrokUrl)
    .then(checkServerUrl)
    .catch((err) => {
      console.error('Migration error:', err);
      process.exit(1);
    });

module.exports = app;

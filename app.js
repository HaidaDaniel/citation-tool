const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const knex = require('./knex');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const searchRouter = require('./routes/search');

const app = express();
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/search', searchRouter);

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
  
  waitForDatabaseConnection()
    .then(() => knex.migrate.latest())
    .then(() => console.log('Migrations are up to date'))
    .catch((err) => {
      console.error('Migration error:', err);
      process.exit(1);
    });

module.exports = app;

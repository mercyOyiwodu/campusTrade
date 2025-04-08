const { Sequelize } = require('sequelize');
require('dotenv').config();
const database = process.env.DATABASE_NAME;
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST;
const dialect = process.env.DATABASE_DIALECT;

const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: dialect
  });

  module.exports = sequelize
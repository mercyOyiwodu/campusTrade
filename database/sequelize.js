const {Sequelize} = require('sequelize')
require('dotenv').config()
const host = process.env.DATABASE_HOST
const dialect = process.env.DATABASE_DIALECT
const sequelize = new Sequelize('campusTrade', 'root', 'root', {
    host: host,
    dialect: dialect
  });

  module.exports = sequelize;
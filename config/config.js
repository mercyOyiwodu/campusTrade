require('dotenv').config()
const username = process.env.DATABASE_USERNAME
const password = process.env.DATABASE_PASSWORD
const database = process.env.DATABASE_NAME
const host = process.env.DATABASE_HOST
const dialect = process.env.DATABASE_DIALECT
  module.exports =
{
  "development": {
    "username": username,
    "password": password,
    "database": database,
    "host": host,
    "dialect": dialect
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

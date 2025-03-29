const express = require('express')
const sequelize = require('./database/sequelize')
require('dotenv').config()


const port = process.env.PORT

const app = express()

const server = async()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
server()

app.use(express.json())

app.listen(port,()=>{
    console.log(`My Server Is Up And Running On Port ${port}`);
    
})
const mongoose = require('mongoose')
require('dotenv').config();
const DB = process.env.DATABASE_URL


mongoose.connect(DB)


.then(()=>{
    console.log('database connected successfully')
})
.catch((error)=>{
    console.log('unable to connect to database'+ error.message)
});
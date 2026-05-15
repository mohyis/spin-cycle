const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose');
const app = express()
const PORT = 5907

app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())






mongoose.connect(process.env.DB_URI).then(()=>{
    console.log('database connected successfully'), app.listen(PORT, ()=>{
    
    console.log('app is listening to port', PORT)
})}).catch((error)=>{console.log(`error connecting to database, ${error.message}`);
})

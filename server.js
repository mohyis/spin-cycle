require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport')
const adminRouter = require('./router/adminRouter')
const staffRouter = require('./router/staffRouter')
const expressSession = require('express-session')
const app = express()
const PORT = 5907

require('./controller/googleAuth')

app.use(express.json())
app.use(expressSession({secret: "mohyis", saveUninitialized: false, resave: false}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/api/admin', adminRouter)
app.use('/api/v1/staff', staffRouter)


// app.use((req, res , next)=>{
//     res.status(500).json({
//         message: `route ${req.originalUrl} and ${req.method} not found`
//     })
// })

app.use((error, req, res , next)=>{
    res.status(500).json({
        message: error.message, 
        status: error.statusCode
    })
})


mongoose.connect(process.env.DB_URI).then(()=>{
    console.log('database connected successfully'), app.listen(PORT, ()=>{
    
    console.log('app is listening to port', PORT)
})}).catch((error)=>{console.log(`error connecting to database, ${error.message}`);
})

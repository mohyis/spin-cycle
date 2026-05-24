const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose');
const passport = require('passport')
const adminRouter = require('./router/adminRouter')
const orderRouter = require('./router/orderRouter')
const staffRouter = require('./router/staffRouter')
const customerRouter = require('./router/customerRouter')
const expressSession = require('express-session')
const app = express()
const PORT = 5907

require('./controller/googleAuth')

app.use(express.json())
app.use(expressSession({secret: "mohyis", saveUninitialized: false, resave: false}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/api/admin', adminRouter)
app.use('/api/order', orderRouter)
app.use('/api/staff', staffRouter)
app.use('/api/customer', customerRouter)

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



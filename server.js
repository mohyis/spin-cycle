const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose');
const passport = require('passport')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const cors = require('cors')
const expressSession = require('express-session')
const app = express()
const PORT = 5907
require('./controller/googleAuth')

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5907'];
app.use(cors({origin: allowedOrigins}));

const adminRouter = require('./router/adminRouter')
const orderRouter = require('./router/orderRouter')
const staffRouter = require('./router/staffRouter')
const customerRouter = require('./router/customerRouter')
const messageRouter = require('./router/messageRouter')
const paymentRouter = require('./router/paymentRouter')


app.use(express.json())
app.use(expressSession({secret: "mohyis", saveUninitialized: false, resave: false}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/api/admin', adminRouter)
app.use('/api/order', orderRouter)
app.use('/api/staff', staffRouter)
app.use('/api/customer', customerRouter)
app.use('/api/message', messageRouter)
app.use('/api/payment', paymentRouter)
// app.use((req, res , next)=>{
//     res.status(500).json({
//         message: `route ${req.originalUrl} and ${req.method} not found`
//     })
// })

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Spin Cycle Laundry Service API',
        version: '2.0.0',
        description: 
            `This is a REST API application made with Express. It retrieves data from JSONPlaceholder.
             The base URL is: http://localhost:5907`,
        license: {
            name: 'Official URL',
            url: 'https://google.com',
        },
        contact: {
            name: 'JSONPlaceholder',
            url: 'https://jsonplaceholder.typicode.com',
        },
    },
    servers: [
        {
            url: 'http://localhost:5907',
            description: 'development server',
        },
    ],
    security: [
        {
            bearerAuth: []
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
};

const options = {
    swaggerDefinition,
    apis: ['./router/*.js']
}

const swaggerSpec = swaggerJsdoc(options);
app.use('/api/v1/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

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



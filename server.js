const express = require('express')
const app = express()
const PORT = 5907

app.listen(PORT, ()=>{
    console.log('app is listening to port:', PORT)
})
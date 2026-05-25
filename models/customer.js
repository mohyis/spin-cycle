const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
    },
     firstName: {
        type: String,  
        required: true
    },
     lastName: {
        type: String,
        required: true
    },
     address: {
        type: String,
        required: true      
    },
    pickUpTime: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    }
})

const customerModel = mongoose.model('customer', customerSchema)

module.exports = customerModel
const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
    },
    customerId: {
        type: String,
        required: true,
        unique: true
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
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
})

const customerModel = mongoose.model('customer', customerSchema)

module.exports = customerModel
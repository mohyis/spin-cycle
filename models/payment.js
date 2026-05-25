const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
    },
    paymentId: {
        type: String,  
        required: true
    },
    item: {
        type: String,  
        required: true
    },
    specification: {
        type: String,  
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,  
        required: true
    },
    amount: {
        type: Number,  
        required: true
    },
    paymentMode: {
        type: String,
        enum: ["cash", "transfer", "pos"],
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["successful", "pending", "refunded"],
        required: true
    }
})

const paymentModel = mongoose.model('payment', paymentSchema)

module.exports = paymentModel
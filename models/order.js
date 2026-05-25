const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
    },
    orderId: {
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
    amount: {
        type: Number,  
        required: true
    },
    quantity: {
        type: Number,  
        required: true
    },
    paymentMode: {
        type: String,
        enum: ["cash", "transfer", "pos"],
        required: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    readyDate: {
        type: Date,
        required: true
    },
    deliveryMode: {
        type: String,
        enum: ["pick-up", "delivery"],
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["new request", "in-progress", "completed", "cancelled"],
        default: "new request",
        required: true
    }
})

const orderModel = mongoose.model('order', orderSchema)

module.exports = orderModel
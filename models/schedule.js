const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
    },
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff',
    },
    fullName: {
        type: String,  
        required: true
    },
    pickUpDate: {
        type: Date,
        required: true
    },
    pickUpTime: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
    note: {
       type: String,
       required: true      
    },
    staffName: {
        type: String,
    },
    idStaff: {
        type: String,
    },
    vehicleType: {
        type: String,
    },
    duty: {
        type: String,
    }
})

const scheduleModel = mongoose.model('schedule', scheduleSchema)

module.exports = scheduleModel
const orderModel = require('../models/order');
const customerModel = require('../models/customer')
const staffModel = require('../models/staff')
const orderId = require('otp-generator');
const generatedOrderId = `#SC-${orderId.generate(7, { lowerCase: false, upperCase: false, specialChars: false, alphabets: false, digits: true })}`;
const date = new Date();
const ready = date.setDate(date.getDate() + 2);
const setReady = new Date(ready);


exports.createSchedule = async(req,res,next)=>{
    try {

    const { 
        firstName, 
        lastName, 
        pickUpDate, 
        pickUpTime, 
        email, address, 
        phoneNumber, 
        deliveryMode, 
        paymentMode,
        item, specification, 
        amountPaid, quantity, 
        note } = req.body;
    if(!firstName || !pickUpDate || !pickUpTime || !email || !address || !phoneNumber || !deliveryMode || !paymentMode){
        return res.status(400).json({
            message: 'Please fill in all required fields'
        })
    }
    const date = new Date();
    const ready = date.setDate(date.getDate() + 2);
    const setReady = new Date(ready);

    const schedule = await orderModel.create({
        orderId: generatedOrderId,
        firstName,
        lastName,
        pickUpDate,
        pickUpTime,
        email,
        address,
        phoneNumber,
        deliveryMode,
        paymentMode,
        deliveryDate: setReady,
        item,
        specification,
        amountPaid,
        quantity,
        bookingDate: new Date(Date.now()),
        readyDate: setReady,
        note
    });
    res.status(201).json({
        message: 'Schedule created successfully',
        data: schedule
    })

    } catch (error) {
        next(error)
    }
}

exports.getAllSchedules = async(req,res,next)=>{
    try {
        const schedules = await orderModel.find({ status: 'completed' }) 
        const requiredSchedules = schedules.map(schedule => {
            return {
                orderId: schedule.orderId,
                address: schedule.address,
                deliveryMode: schedule.deliveryMode,
                deliveryDate: schedule.deliveryDate,
                deliveryTime: schedule.deliveryTime,
                status: schedule.status,
                staffName: schedule.staffName,
            }
        })

        res.status(200).json({
            message: 'Schedules retrieved successfully',
            requiredSchedules
        })
    } catch (error) {
        next(error)
    }
};

exports.assignStaffToSchedule = async(req,res,next)=>{
    try {
        const {id} = req.user;
        const scheduleId = req.params.id
        const { idStaff, staffName, vehicleType, duty } = req.body;

        const staff = await staffModel.findOne({ staffId: idStaff });
        if(staff.staffId !== idStaff){
            return res.status(404).json({
                message: 'Staff not found'
            })
        }

        const scheduleUpdate = {
            adminId: id,
            staffId: staff._id,
            idStaff,    
            staffName: staff.staffName,
            vehicleType,
            duty
        };

        const updatedSchedule = await orderModel.findByIdAndUpdate(scheduleId, scheduleUpdate, { new: true });

        if (!updatedSchedule) {
            return res.status(404).json({
                message: 'Schedule not found'
            });
        }

        updatedSchedule.status = 'in-progress';
        await updatedSchedule.save();

        res.status(200).json({
            message: 'Schedule updated successfully',
            data: updatedSchedule
        });
    } catch (error) {
        next(error);
    }
};

exports.updateScheduleStatus = async(req,res,next)=>{
    try {
        const { status } = req.body
        const { id } = req.params

            const scheduleUpdate = {
            status
        }
        const schedule = await orderModel.findByIdAndUpdate(id , scheduleUpdate, {new: true})
        if(!schedule){
            return res.status(404).json({   
                message: 'Schedule not found'
            })
        }
        res.status(200).json({
            message: 'Schedule updated successfully',
            schedule
        })
    } catch (error) {
        next(error)
    }
};

exports.createOrder = async(req,res,next)=>{
    try {
        const {id} = req.user;
        const cusId = req.params.id
        const { pickUpDate, pickUpTime, deliveryMode, paymentMode, item, specification, amountPaid, quantity, address, note } = req.body 
        

        const customer = await customerModel.findById(cusId)

        const order = await orderModel.create({
            adminId: id,
            customerId: cusId,
            orderId: generatedOrderId,
            firstName: customer.firstName,
            lastName: customer.lastName,
            pickUpDate,
            pickUpTime,
            email: customer.email,
            address: customer.address,
            phoneNumber: customer.phoneNumber,
            deliveryMode,
            paymentMode,
            deliveryDate: setReady,
            item,
            specification,
            amountPaid,
            quantity,
            bookingDate: new Date(Date.now()),
            readyDate: setReady,
            note
            
        })
        
        res.status(201).json({
            message: 'Order created successfully',
            order
        })
    } catch (error) {
        next(error)
    }
};


exports.getAllOrders = async(req,res,next)=>{
    try {
        const orders = await orderModel.find() 
        res.status(200).json({
            message: 'Orders retrieved successfully',
            orders
        })
    } catch (error) {
        next(error)
    }
};

exports.getNewRequests = async(req,res,next)=>{
    try {
        const orders = await orderModel.find({ status: 'new request' })
        res.status(200).json({
            message: 'New requests retrieved successfully',
            orders
        })
    } catch (error) {
        next(error)
    }
}

exports.getInProgress = async(req,res,next)=>{
    try {
        const orders = await orderModel.find({ status: 'in-progress' })
        res.status(200).json({
            message: 'In-progress orders retrieved successfully',
            orders
        })
    } catch (error) {
        next(error)
    }
}

exports.getCompleted = async(req,res,next)=>{
    try {
        const orders = await orderModel.find({ status: 'completed' })
        res.status(200).json({
            message: 'Completed orders retrieved successfully',
            orders
        })
    } catch (error) {
        next(error)
    }
};

exports.getCancelled = async(req,res,next)=>{
    try {
        const orders = await orderModel.find({ status: 'cancelled' })
        res.status(200).json({
            message: 'Cancelled orders retrieved successfully',
            orders
        })
    } catch (error) {
        next(error)
    }
}

exports.getOneOrder = async(req,res,next)=>{
    try {
        const {id} = req.params
        const order = await orderModel.findById(id)
        if(!order){
            return res.status(404).json({   
                message: 'Order not found'
            })
        }
        res.status(200).json({
            message: 'Order retrieved successfully',
            order
        })
    } catch (error) {
        next(error)
    }
}

exports.updateOrderStatus = async(req,res,next)=>{
    try {
        const { deliveryTime } = req.body
        const {id} = req.user;
        const orderId = req.params.id

            const orderUpdate = {
            deliveryTime,
        }
        const order = await orderModel.findOneAndUpdate({ orderId: orderId, adminId: id } , orderUpdate, {new: true})
        if(!order){
            return res.status(404).json({   
                message: 'Order not found'
            })
        }

        order.status = 'completed'
        await order.save();

        res.status(200).json({
            message: 'Order updated successfully',
            order
        })
    } catch (error) {
        next(error)
    }
};
 
exports.deleteOrder = async(req,res,next)=>{
    try {
        const {id} = req.user;  
        const orderId = req.params.id
        const order = await orderModel.findOneAndDelete({ orderId: orderId, adminId: id })
        if(!order){
            return res.status(404).json({   
                message: 'Order not found'
            })
        }
        res.status(200).json({
            message: 'Order deleted successfully',
            order
        })
    } catch (error) {
        next(error)
    }
};

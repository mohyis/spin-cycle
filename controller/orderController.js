const orderModel = require('../models/order');
const customerModel = require('../models/customer')
const staffModel = require('../models/staff')
const orderId = require('otp-generator');
const generatedOrderId = `#SC-${orderId.generate(7, { lowerCase: false, upperCase: false, specialChars: false, alphabets: false, digits: true })}`;
const date = new Date();
const ready = date.setDate(date.getDate() + 2);
const setReady = new Date(ready);

// endpoint to create schedule for delivery or pickup by customers and admin.

exports.createSchedule = async(req,res,next)=>{
    try {
        const unitPrice = 500;

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
        amount, quantity, 
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
        quantity,
        amount: unitPrice * quantity,
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

// Schedule completed orders for delivery/pickup by assigning staff.

exports.getAllCompletedOrders = async(req,res,next)=>{
    try {
        const schedules = await orderModel.find({ status: 'completed', idStaff: null }) 
        const requiredSchedules = schedules.map(schedule => {
            return {
                _id: schedule._id,
                orderId: schedule.orderId,
                address: schedule.address,
                deliveryMode: schedule.deliveryMode,
                deliveryDate: schedule.deliveryDate,
                deliveryTime: schedule.deliveryTime,
                status: schedule.status,
                staffName: schedule.staffName || 'Not assigned yet'
            }
        })

        res.status(200).json({
            message: 'Completed Orders retrieved successfully',
            requiredSchedules
        })
    } catch (error) {
        next(error)
    }
};

// assign staff to orders ready for delivery.

exports.assignStaffToSchedule = async(req,res,next)=>{
    try {
        const {id} = req.user;
        const scheduleId = req.params.id
        const { idStaff, staffName, vehicleType, duty } = req.body;

        const order = await orderModel.findOne(scheduleId);
        if (order.status !== 'completed') {
            return res.status(400).json({
                message: 'Only completed orders can be assigned to staff'
            })
        }

        const staff = await staffModel.findOne({ staffId: idStaff });
        if(!staff){
            return res.status(404).json({
                message: 'Staff not found'
            })
        };

        const scheduleUpdate = {
            adminId: id,
            staffId: staff._id,
            idStaff,    
            staffName: staffName || `${staff.firstName} ${staff.lastName}`,
            vehicleType,
            duty
        };

        const updatedSchedule = await orderModel.findByIdAndUpdate(scheduleId, scheduleUpdate, { new: true });
    
        if (!updatedSchedule) {
            return res.status(404).json({
                message: 'Schedule not found'
            });
        }

        updatedSchedule.deliveryTime = new Date(Date.now());
        await updatedSchedule.save();

        res.status(200).json({
            message: 'Staff assigned successfully',
            data: updatedSchedule
        });
    } catch (error) {
        next(error);
    }
};


// To get all completed schedules that has been delivered by staff /picked up by customer Or the orders that have been assigned to a staff for delivery/pickup.
exports.getAllCompletedSchedules = async(req,res,next)=>{
    try {
        const schedules = await orderModel.find({ status: 'completed' })
        const requiredSchedules = schedules.map(schedule => {
            return {
                _id: schedule._id,
                orderId: schedule.orderId,
                address: schedule.address,
                deliveryMode: schedule.deliveryMode,
                deliveryDate: schedule.deliveryDate,
                deliveryTime: schedule.deliveryTime,
                status: schedule.status,
                staffName: schedule.staffName
            }
        })

        res.status(200).json({
            message: 'Completed schedules retrieved successfully',
            requiredSchedules
         })
    } catch (error) {
        next(error)
    }
};

// An endpoint to create orders by admin for customers who book through phone calls or walk-in. 

exports.createOrder = async(req,res,next)=>{
    try {
        const {id} = req.user;
        const cusId = req.params.id
        const { pickUpDate, pickUpTime, deliveryMode, paymentMode, item, specification, quantity, amount, address, note } = req.body 
        

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
            quantity,
            amount,
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
        const requiredOrders = orders.map(order => {
            return {
                _id: order._id,
                orderId: order.orderId,
                address: order.address,
                amount: order.amount,
                paymentMode: order.paymentMode,
                bookingDate: order.bookingDate,
                deliveryDate: order.deliveryDate,
                deliveryMode: order.deliveryMode,
                status: order.status,
            }
        })
        res.status(200).json({
            message: 'All Orders retrieved successfully',
            requiredOrders
        })
    } catch (error) {
        next(error)
    }
};

exports.updateOrderStatus = async(req,res,next)=>{
    try {
        const { status } = req.body
        const {id} = req.user;
        const orderId = req.params.id

        const order = await orderModel.findOneAndUpdate({ orderId: orderId, adminId: id } , { status }, {new: true})
        if(!order){
            return res.status(404).json({   
                message: 'Order not found'
            })
        }

        res.status(200).json({
            message: 'Order status updated successfully',
            order
        })
    } catch (error) {
        next(error)
    }
};

exports.getNewRequests = async(req,res,next)=>{
    try {
        const orders = await orderModel.find({ status: 'new request' })
        const requiredOrders = orders.map(order => {
            return {
                _id: order._id,
                orderId: order.orderId,
                address: order.address,
                amount: order.amount,
                paymentMode: order.paymentMode,
                bookingDate: order.bookingDate,
                deliveryDate: order.deliveryDate,
                deliveryMode: order.deliveryMode,
                status: order.status,
            }
        })
        res.status(200).json({
            message: 'New requests retrieved successfully',
            requiredOrders
        })
    } catch (error) {
        next(error)
    }
}

exports.getInProgress = async(req,res,next)=>{
    try {
        const orders = await orderModel.find({ status: 'in-progress' })
        const requiredOrders = orders.map(order => {
            return {
                _id: order._id,
                orderId: order.orderId,
                address: order.address,
                amount: order.amount,
                paymentMode: order.paymentMode,
                bookingDate: order.bookingDate,
                deliveryDate: order.deliveryDate,
                deliveryMode: order.deliveryMode,
                status: order.status,
            }
        })
        res.status(200).json({
            message: 'In-progress orders retrieved successfully',
            requiredOrders
        })
    } catch (error) {
        next(error)
    }
}

exports.getCompleted = async(req,res,next)=>{
    try {
        const orders = await orderModel.find({ status: 'completed' })
        const requiredOrders = orders.map(order => {
            return {
                _id: order._id,
                orderId: order.orderId,
                address: order.address,
                amount: order.amount,
                paymentMode: order.paymentMode,
                bookingDate: order.bookingDate,
                deliveryDate: order.deliveryDate,
                deliveryMode: order.deliveryMode,
                status: order.status,
            }
        })
        res.status(200).json({
            message: 'Completed orders retrieved successfully',
            requiredOrders
        })
    } catch (error) {
        next(error)
    }
};

exports.getCancelled = async(req,res,next)=>{
    try {
        const orders = await orderModel.find({ status: 'cancelled' })
        const requiredOrders = orders.map(order => {
            return {
                _id: order._id,
                orderId: order.orderId,
                address: order.address,
                amount: order.amount,
                paymentMode: order.paymentMode,
                bookingDate: order.bookingDate,
                deliveryDate: order.deliveryDate,
                deliveryMode: order.deliveryMode,
                status: order.status,
            }
        })
        res.status(200).json({
            message: 'Cancelled orders retrieved successfully',
            requiredOrders
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

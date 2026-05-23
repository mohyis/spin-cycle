const customerModel = require('../model/customerModel')

exports.createCustomer = async (req, res, next) => {
    try {
        const {id} = req.user;
        const { firstName, lastName, address, email, phoneNumber } = req.body
        const customer = await customerModel.create({
            adminId: id,
            firstName,
            lastName,
            address,
            email,
            phoneNumber
        })
        res.status(201).json({
            message: 'Customer created successfully',
            customer
        })
    } catch (error) {
        next(error)
    }
};

exports.getAllCustomers = async (req, res, next) => {
    try {
        const customers = await customerModel.find();   
        res.status(200).json({
            message: 'Customers retrieved successfully',
            customers
        })
    } catch (error) {
        next(error)
    }   
};

exports.getOneCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await customerModel.findById(id);
        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            })
        };  
            res.status(200).json({  
            message: 'Customer retrieved successfully',
            customer
        })
    } catch (error) {
        next(error)
    }
};

exports.getAllCustomers = async (req, res, next) => {
    try {
        const customers = await customerModel.find();   
        res.status(200).json({
            message: 'Customers retrieved successfully',
            customers
        })
    } catch (error) {
        next(error)
    }   
};

exports.getOneCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await customerModel.findById(id);
        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            })
        };  
            res.status(200).json({  
            message: 'Customer retrieved successfully',
            customer
        })
    } catch (error) {
        next(error)
    }
};

exports.updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, address, email, phoneNumber, pickUpTime } = req.body;
        const customer = await customerModel.findById(id);
        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            })
        };  
        customer.firstName = firstName || customer.firstName;
        customer.lastName = lastName || customer.lastName;
        customer.address = address || customer.address;
        customer.email = email || customer.email;
        customer.phoneNumber = phoneNumber || customer.phoneNumber;
        customer.pickUpTime = pickUpTime || customer.pickUpTime; 
        await customer.save();

        res.status(200).json({
            message: 'Customer updated successfully',
            customer
        })
     } catch (error) {
      next(error)
    }
};
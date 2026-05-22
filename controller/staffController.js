const staffModel = require('../models/staff');
const bcrypt = require('bcrypt')


exports.createStaff = async (req, res) => {
    try {
        const { firstName, lastName, email, password, address, position } = req.body;
        const existingStaff = await staffModel.findOne({ email: email.toLowerCase() });

        if (existingStaff) {
            return res.status(400).json({
                message: 'Staff already exist'
            })
        };

        const hash = await bcrypt.hash(password, await bcrypt.genSalt(10))
        const staff = await staffModel.create({
            firstName,
            lastName,
            email,
            address,
            position,
            password: hash
        });

        res.status(201).json({
            message: 'Staff created successfully',
            data: staff
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};


exports.getAllStaff = async (req, res) => {
    try {
        const staffs = await staffModel.find();
        res.status(200).json({
            message: 'Get all staffs',
            data: staffs
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};


exports.getOneStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await staffModel.findById(id);

        if (!staff) {
            return res.status(404).json({
                message: 'Staff not found'
            })
        };

        res.status(200).json({
            message: 'Get staff',
            data: staff
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};
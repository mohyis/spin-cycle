const userModel = require('../models/user')

exports.createUser = async(req, res)=>{
    try {
        const {firstName, lastName, email, password, confirmPassword} = req.body

        if(password !== confirmPassword){
            return res.status(400).json({
                message: 'password does not match'
            })
        }

        const user = await userModel.create({
            firstName,
            lastName,
            email,
            password
        })

        const data = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }

        res.status(201).json({
            message: 'account created',
            data
        })




        
    } catch (error) {
        res.status(500).json(
            {
                message: error.message
            }
        )
    }
}
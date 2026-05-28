const paymentModel  = require('../models/payment');
const orderModel = require('../models/order');
const otpGen = require('otp-generator');
const payId = `INV-${otpGen.generate(6, {digits: true, lowerCaseAlphabets: true,upperCaseAlphabets: true, specialChars: false})}`
const reference = otpGen.generate(12, {digits: true, lowerCaseAlphabets: true,upperCaseAlphabets: true, specialChars: false})
const axios = require('axios')

exports.payOrder = async(req, res, next)=>{
    try {
        
        const {id} = req.params;

        const order = await orderModel.findById(id)

        if(!order){
            return next({
                message: 'order not found',
                statusCode: 404
            })
        } 

        const payload = {
            amount: order.amount,
            customer: {
                email: order.email,
                name: `${order.firstName} ${order.lastName}`
            },
            redirect_url: 'http://localhost:5907/api/payment/verify-payment',
            currency: 'NGN',
            reference: reference
        };

        const { data } = await axios.post(`https://api.korapay.com/merchant/api/v1/charges/initialize`,
            payload, {
                headers: {
                    Authorization: `Bearer ${process.env.KORA_SK}`
                }
            }
        );


        const payment = new paymentModel({
            adminId: order.adminId,
            customerId: order.customerId,
            orderId: id,
            OrderId: order.orderId,
            paymentId: payId,
            reference: reference,
            item: order.item,
            specification: order.specification,
            quantity: order.quantity,
            amount: order.amount,
            paymentMode: order.paymentMode,
            paymentDate: new Date(Date.now()),
            status: "pending"
        })

        await payment.save();

        res.status(200).json({
            message: 'payment initialized successfully',
            data: data.data
        })

    } catch (error) {
       next({
        message: error.message, 
        statusCode: 500
      })
    }
}

exports.verifyPayment = async(req,res, next)=>{
    try {
        const { reference } = req.query
        const payment = await paymentModel.findOne({reference});

        if(!payment){
            return next({
                message: 'no payment found',
                statusCode: 404
            })
        }

        const { data } = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.KORA_SK}`
                }
            }
        )

        if(data.status === true && data.data.status === 'processing') {
            payment.status = 'pending'

            await payment.save();
            return res.status(200).json({
                message: 'payment is still processing'
            })
        }

        if(data.status === true && data.data.status === 'success') {
            payment.status = 'successful'

            await payment.save();
            return res.status(200).json({
                message: 'payment successful'
            })
        }

        payment.status = 'refunded'

        await payment.save();
        return res.status(200).json({
            message: 'payment failed and refunded'
        })

    } catch (error) {
        next({
        message: error.message, 
        statusCode: 500
      })
    }
}
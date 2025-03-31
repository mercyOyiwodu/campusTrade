const axios = require('axios');
const transactionModel = require('../models/transaction');
const otpGenerator = require('otp-generator'); 
const SECRET_KEY = process.env.KORA_SECRET_KEY
const otp = otpGenerator.generate(12, {specialChars: false});
const ref = `TCA-AF-${otp}`
const formatedDate = new Date().toLocaleString();

exports.initializePayment = async (req, res) => {
    try {
        const { amount, email, name } = req.body;
        if (!email || !amount || !name){
            return res.status(400).json({
                message: 'please input all field'
            })
        }
        const paymentData = {
            amount,
            customer:{
                name,
                email
            },
            currency: 'NGN',
            reference: ref
        }
        const response = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', paymentData, {
            headers: {
                Authorization: `Bearer ${SECRET_KEY}`
            }
        });
        const { data } = response?.data
        const payment = new transactionModel({
            name,
            email,
            amount,
            reference: paymentData.reference,
            paymentDate: formatedDate
        })
         
        await payment.save();
        
        console.log('data', response)
        res.status(200).json({
            message: 'Payment Initialized Successfully',
            data: {
                reference: data?.reference,
                checkout_url: data?.checkout_url
            }
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: ' internal server error'
        })
    }
}



exports.verifyPayment = async (req, res) =>{
    try {
        const { reference } = req.query;

        const response = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`,{
               headers:{
                Authorization: `Bearer ${SECRET_KEY}`
            }
        });
        const { data } = response?.data;

        if(data?.status && data?.status === 'success'){
          const payment = await transactionModel.findOneAndUpdate({ reference }, { status: 'success' }, {new: true })
            res.status(200).json({
                message: 'payment Verify successfully',
            data: payment
            })
        }else{
         const payment = await transactionModel.findOneAndUpdate({ reference }, { status: 'Failed' }, {new: true })
            res.status(400).json({
                message: 'payment Verify failed',
                data: payment
            })
        }
    } catch (error) {
      console.log(error.message)
      res.status(500).json({
        message: 'Error Verifying Payment'
      })  
    }
}


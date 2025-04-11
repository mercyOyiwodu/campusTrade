const transactionModel = require('../models/transaction');
const axios = require('axios')
const otpGenerator = require('otp-generator');
const otp = otpGenerator.generate(12, {specialChars: false});
const Secret_key = process.env.Korapay_Secret_Key;
const ref = `TCA-AF-${otp}`
const formatedDate = new Date().toLocaleString();

exports.initializePayment = async(req, res) =>{
    try {
        const {email, amount, name} = req.body;
        if(!email || !name || !amount){
            return res.status(400).json({
                message:'Please input all fields'
            })
        };
         const paymentData = {
            amount,
            customer:{
                name,
                email
            },
            currency: "NGN",
            reference: ref
         }
         const response = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', paymentData,{
            headers:{
                Authorization: `Bearer ${Secret_key}`
            }
         });
         const {data} = response?.data;
         const payment = new transactionModel({
            name, 
            amount,
            email,
            reference:paymentData.reference,
            paymentDate: formatedDate
         }) 

         await payment.save();

         res.status(200).json({
            message: 'Payment initialized successfully',
            data:{
                reference: data?.reference,
                checkout_url:data?.checkout_url
            }
         })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Error initializing payment' +error.message 
        })
    }
}

exports.verifyPayment = async (req, res)=>{
    try {
        //extract the reference from the qquery prams
        const {reference} = req.query;
        //get the payment data from kora by snding a get method to their api
        const response = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`, {
            headers:{Authorization: `Bearer ${Secret_key}`}
        });
        
        //extract the data from the response
        const {data} = response?.data;
        //update your database according to the status of te resonse from KORAPAY API
        if (data?.status && data?.status === 'success'){
            //update to success if yes
            const payment = await transactionModel.update({reference}, {status: 'Success'}, {new: true})
            return res.status(200).json({
                message:'Payment verified successfully',
                data: payment
            }) 
        }else  {
            const payment = await transactionModel.update({reference}, {status: 'Failed'}, {new: true})
            return res.status(200).json({
                message:'Payment verification failed'
            }) 
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Error initializing payment" + error.message 
        })
    }
}

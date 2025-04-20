const transactionModel = require('../models/transaction');
const axios = require('axios')
require('dotenv').config()
const otpGenerator = require('otp-generator');
const otp = otpGenerator.generate(12, {specialChars: false});
const Secret_key = process.env.Korapay_Secret_Key;
const ref = `TCA-YU-${otp}`
const formatedDate = new Date().toLocaleString();

exports.initializePayment = async(req, res) => {
    try {
        const { email, amount, name } = req.body;
        if (!email || !name || !amount) {
            return res.status(400).json({
                message: 'Please input all fields'
            });
        }

        const paymentData = {
            amount,
            customer: {
                name,
                email
            },
            currency: "NGN",
            reference: ref,
            redirect_url: `https://legacy-builder.vercel.app/verifyingPayment`,
        };

        const response = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', paymentData, {
            headers: {
                Authorization: `Bearer ${Secret_key}`
            }
        });

        const { data } = response?.data;

        // Create a new transaction record
        const payment = new transactionModel({
            name,
            amount,
            email,
            reference: paymentData.reference,
            paymentDate: formatedDate,
            status: 'Pending', 
            purpose: 'post_fee',
            used: false, 
        });

        await payment.save();

        res.status(200).json({
            message: 'Payment initialized successfully',
            data: {
                reference: data?.reference,
            checkout_url: data?.checkout_url,
            redirect_url: paymentData.redirect_url,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error initializing payment: ' + error
        });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { reference } = req.query;

        const response = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`, {
            headers: { Authorization: `Bearer ${Secret_key}` }
        });

        const { data } = response?.data;

        if (data?.status === 'success') {

            await transactionModel.update(
                { status: 'Success', used: true },
                { where: { reference } }
            );

            // Fetch and return the updated transaction data
            const updatedPayment = await transactionModel.findOne({ where: { reference } });

            return res.status(200).json({
                message: 'Payment verified successfully',
                data: updatedPayment
            });
        } else {
            // If payment is unsuccessful, mark as failed
            await transactionModel.update(
                { status: 'Failed' },
                { where: { reference } }
            );
            return res.status(200).json({
                message: 'Payment verification failed'
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Error verifying payment: " + error.message
        });
    }
};

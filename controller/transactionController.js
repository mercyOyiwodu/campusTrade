const transactionModel = require('../models/transaction');
const koraPayService = require('../services/koraPayService');

exports.initializePayment = async (req, res) => {
    try {
        const { email, amount, name } = req.body;
        
        if (!email || !name || !amount) {
            return res.status(400).json({
                message: 'Please input all fields'
            });
        }

        // Initialize payment with KoraPay service
        const paymentResponse = await koraPayService.initializePayment({ amount, name, email });
        const { reference, data } = paymentResponse;
        
        // Save transaction to database
        const payment = new transactionModel({
            name,
            amount,
            email,
            reference,
            paymentDate: new Date().toLocaleString()
        });
        
        await payment.save();
        
        // Return response to client
        res.status(200).json({
            message: 'Payment initialized successfully',
            data: {
                reference: data.reference,
                checkout_url: data.checkout_url
            }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Error initializing payment: ' + error.message
        });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        // Extract the reference from the query params
        const { reference } = req.query;
        
        // Verify payment using KoraPay service
        const verificationResponse = await koraPayService.verifyPayment(reference);
        const { data } = verificationResponse;
        
        // Update database according to the status of the response
        if (data.status === 'success') {
            // Update to success
            await transactionModel.update(
                { status: 'Success' },
                { where: { reference } }
            );
            
            const updatedPayment = await transactionModel.findOne({ where: { reference } });
            
            return res.status(200).json({
                message: 'Payment verified successfully',
                data: updatedPayment
            });
        } else {
            // Update to failed
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
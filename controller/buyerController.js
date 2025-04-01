const Buyer = require('../models/buyer');
const bcrypt = require('bcryptjs');

exports.createBuyers = async(req, res)=>{
    try {
       const {fullName, email, password, location, phoneNumber} =req.body;
       
       const buyerExists = await Buyer.findOne({ where: { email: email.toLowerCase() } });

       if (buyerExists) {
                   return res.status(400).json({
                       message: `Buyer with email: ${email} already exists`
                   })
               };

       // Encrypt the user's password
               const salt = await bcrypt.genSalt(10);
               const hashedPassword = await bcrypt.hash(password, salt);
       
        // Create the user details
        const buyer = await Buyer.create({
            fullName,
            password: hashedPassword,
            email: email.toLowerCase(),
            phoneNumber,
            location, 
            // school,
            // isVerified,
            // isAdmin
        });

        // Send a success response
        res.status(201).json({
            message: 'Buyer created successfully',
            data: buyer
        });
 

    }  catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error creating Buyer: ' + error.message })
    }
}
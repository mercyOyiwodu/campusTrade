const Seller = require('../models/seller');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.createSellers = async(req, res) => {
    try {
        const { fullName, phoneNumber, email, password, location, school, connectLink, description } = req.body;

        const sellerExists = await Seller.findOne({ where: { email: email.toLowerCase() } });
        if (sellerExists) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: `Seller with email: ${email} already exists`
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error, data) => {
            if (error) {
                return res.status(400).json({
                    message: error.message
                });
            } else {
                return data;
            }
        });

        fs.unlinkSync(req.file.path);

        const seller = await Seller.create({
            fullName,
            password: hashedPassword,
            email: email.toLowerCase(),
            phoneNumber,
            profilePic: result.secure_url,
            location,
            school,
            connectLink,
            description
        });

        res.status(201).json({
            message: 'Seller created successfully',
            data: seller
        });

    } catch (error) {
        res.status(500).json({ message: 'Error creating Seller: ' + error.message });
    }
}
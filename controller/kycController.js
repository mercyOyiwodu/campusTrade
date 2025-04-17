const Seller = require('../models/seller');
const SellerKYC = require('../models/sellerkyc');
const cloudinary = require('../config/cloudinary');
const { toPascalCase } = require('../utils/stringHelpers');
const fs = require('fs')

exports.profileDetails = async(req, res) =>{
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'Profile image is required'
            });
        }

        if (req.body.fullName) {
            req.body.fullName = toPascalCase(req.body.fullName);
        }


        const {id:sellerId} = req.params;
        const {jambRegNo, description, school, gender , whatsappLink, phoneNumber, fullName } = req.body;

        const userExists = await Seller.findByPk(sellerId);
        if(!userExists){
            res.status(404).json({
                message: "Seller not found"
            })
        }
         // Use Cloudinary promise-based approach
            const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error, data) => {
                if (error) {
                    return res.status(400).json({
                        message: error.message
                    })
                } else {
                    return data
                }
            });
            
            // Unlink the file from our local storage after upload
            fs.unlinkSync(req.file.path);

        const data = {
            school,
            jambRegNo,
            id:sellerId,
            description,
            whatsappLink,
            gender,
            phoneNumber,
            profilePic: result.secure_url,
            fullName
        };
        const profile = await SellerKYC.create(data);
        res.status(201).json({
            message: 'Successfully completed your profile update',
            data: profile
        })


    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

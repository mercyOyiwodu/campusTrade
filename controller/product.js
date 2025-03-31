const Product = require('../models/product')
const User = require('../models/user')
const Seller = require('../models/seller')
const cloudinary = require('../config/cloudinary')
const fs = require('fs')

exports.createProduct= async(req,res) =>{
    try {
        const { price, media, detail, category } = req.body
        const {sellerId} = req.params

        const seller = await Seller.findByPk({ where: { id: sellerId } })
        if (!seller) {
            fs.unlinkSync(req.file.path)
            return res.status(404).json({
                message: 'Seller not found'
            })
        }
        const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error, data) => {
            if (error) {
                return res.status(400).json({
                    message: error.message
                })
            } else {
                return data
            }
        });
        fs.unlinkSync(req.file.path);

        const product = await Product.create({
            price,
            media: result.secure_url,
            detail,
            category,
            sellerId: sellerId,
            timeCreated: new Date()
        })
        res.status(201).json({
            message: 'Product created successfully',
            data: product
        })
    } catch (error) {
        console.log(error);
        if (req.file.path) {
            fs.unlinkSync(req.file.path)
        }
        res.status(500).json({
            message: "Error Creating Product"
        })
    }
}
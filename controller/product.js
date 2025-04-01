const Product = require('../models/product');
const Transaction = require("../models/transactionModel");
const Seller = require("../models/seller");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.createProduct = async (req, res) => {
    try {
        const { price, media, detail, category } = req.body;
        const { sellerId } = req.params;
        const postFee = 500;

        const seller = await Seller.findByPk(sellerId);
        if (!seller) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: "Seller not found" });
        }

        const totalPaid = await Transaction.sum("amountPaid", {
            where: {
                userId: sellerId,
                status: "successful",
            },
        });

        if (!totalPaid || totalPaid < postFee) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(403).json({
                message: "Sellers must pay at least ₦500 before posting a product.",
            });
        }

        const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto" });
        fs.unlinkSync(req.file.path);

        const product = await Product.create({
            price,
            media: result.secure_url,
            detail,
            category,
            sellerId,
            timeCreated: new Date(),
        });

        res.status(201).json({
            message: "Post created successfully",
            data: product,
        });
    } catch (error) {
        console.log(error);
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: "Error Creating Post" });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                {
                    model: Seller,
                    attributes: ["fullName", "email"],
                },
            ],
        });

        res.status(200).json({
            message: "Products retrieved successfully",
            data: products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving products" });
    }
}

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Seller,
                    attributes: ["fullName", "email"],
                },
            ],
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product retrieved successfully",
            data: product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving product" });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { price, media, detail, category } = req.body;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto" });
            fs.unlinkSync(req.file.path);
            product.media = result.secure_url;
        }

        product.price = price || product.price;
        product.detail = detail || product.detail;
        product.category = category || product.category;

        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            data: product,
        });
    } catch (error) {
        console.log(error);
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: "Error updating product" });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.destroy();

        res.status(200).json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting product" });
    }
}

const Product = require('../models/product');
const Transaction = require("../models/transaction");
const Seller = require("../models/seller");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.createProduct = async (req, res) => {
    try {
      const { productName, price, condition, school, description } = req.body;
      const { categoryId, sellerId } = req.params;
      const postFee = price * 0.1;
  
      const seller = await Seller.findByPk(sellerId);
      if (!seller) {
        req.files.forEach(file => fs.unlinkSync(file.path));
        return res.status(404).json({ message: "Seller not found" });
      }
  
      const totalPaid = await Transaction.sum("amountPaid", {
        where: { userId: sellerId, status: "successful" },
      });
  
      if (!totalPaid || totalPaid < postFee) {
        req.files.forEach(file => fs.unlinkSync(file.path));
        return res.status(403).json({
          message: `Sellers must pay at least ₦${postFee} before posting a product.`,
        });
      }
  
      // Upload multiple files to Cloudinary
      const uploadedMedia = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
        });
        uploadedMedia.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
  
      const product = await Product.create({
        productName,
        price,
        condition,
        school,
        description,
        media: uploadedMedia, 
        categoryId,
        sellerId,
        timeCreated: new Date(),
      });
  
      res.status(201).json({ message: "Post created successfully", data: product });
    } catch (error) {
      console.error(error);
      if (req.files) req.files.forEach(file => fs.unlinkSync(file.path));
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
      const { price, productName, condition, school, description, categoryId } = req.body;
  
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      let mediaUrls = [];
      if (req.files && req.files.length > 0) {
        // Upload each file sequentially
        for (let file of req.files) {
          const uploadResult = await cloudinary.uploader.upload(file.path, { resource_type: "auto" });
          mediaUrls.push(uploadResult.secure_url);
          // Remove the local file after uploading
          fs.unlinkSync(file.path);
        }
  
        // Update the media field with the uploaded URLs
        product.media = mediaUrls;
      }
  
      // Update other fields if provided
      product.price = price || product.price;
      product.productName = productName || product.productName;
      product.condition = condition || product.condition;
      product.school = school || product.school;
      product.description = description || product.description;
      if (categoryId) {
        product.categoryId = categoryId;
      }
  
      await product.save();
  
      res.status(200).json({
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      console.log(error);
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => fs.unlinkSync(file.path));
      }
      res.status(500).json({ message: "Error updating product" });
    }
  };
  

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

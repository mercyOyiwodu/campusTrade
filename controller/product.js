const Product = require('../models/product');
const Transaction = require("../models/transaction");
const Seller = require("../models/seller");
const Subcategory = require("../models/subCategory");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const SellerKYC = require('../models/sellerkyc');
const Category = require('../models/category');


exports.createProduct = async (req, res) => {
  try {
    const { categoryId, subCategoryId} = req.params;
    const { id: sellerId } = req.seller
    const { productName, price, condition, school, description } = req.body;
    if (!productName || !price || !condition || !school || !description) {
      return res.status(400).json({ message: "Please enter all required fields" });
    }
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const subCategoryExists = await Subcategory.findByPk(subCategoryId);
    if (!subCategoryExists) {
      return res.status(404).json({ message: "Sub category not found" });
    }
    const seller = await Seller.findByPk(sellerId);
    if (!seller) {
      if (req.files) req.files.forEach(file => fs.unlinkSync(file.path));
      return res.status(404).json({ message: "Seller not found" });
    }
    const sellerKYC = await SellerKYC.findByPk(sellerId);
    if (!sellerKYC) {
      return res.status(400).json({ message: "Please complete your kyc before proceeding" });
    }

    const uploadedMedia = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
        });
        uploadedMedia.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    }

    const product = await Product.create({
      productName,
      price,
      condition,
      school,
      description,
      media: uploadedMedia,
      sellerId,
      subCategoryId,
      categoryId,
      timeCreated: new Date(),
      status: 'pending'
    });
    console.log(product);
    res.status(201).json({ message: "Post created successfully", data: product });

  } catch (error) {
    console.error(error);
    if (req.files) req.files.forEach(file => fs.unlinkSync(file.path));
    res.status(500).json({ message: error.message });
  }
};
exports.getRecentProductsBySeller = async (req, res) => {
  try {
    const { id: sellerId } = req.params;

    const products = await Product.findAll({
      where: { sellerId }
    });

    const sortedProducts = products.sort((a, b) => {
      return new Date(b.timeCreated) - new Date(a.timeCreated);  // Sort in descending order
    });

    res.status(200).json({
      message: "Recent posts fetched successfully",
      data: sortedProducts,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get All Products with their Subcategory and Seller
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Subcategory,
          // as: 'subCategory',
        },
        {
          model: Seller,
          as: 'seller',
        },
      ],
    });

    res.status(200).json({
      message: 'Products fetched successfully',
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};



exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Subcategory,
          as: 'subcategory',
          include: [
            {
              model: Category,
              as: 'category',
            },
          ],
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
    res.status(500).json({ message: error.message });
  }
};

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
        for (let file of req.files) {
          const uploadResult = await cloudinary.uploader.upload(file.path, { resource_type: "auto" });
          mediaUrls.push(uploadResult.secure_url);
          fs.unlinkSync(file.path);
        }
  
        product.media = mediaUrls;
      }
  
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
      res.status(500).json({ message: error.message  });
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
        res.status(500).json({ message: error.message  });
    }
}

exports.approveProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.status = "approved";
    await product.save();

    res.status(200).json({ message: "Product approved", data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.status = "not_approved";
    await product.save();

    res.status(200).json({ message: "Product rejected", data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getApprovedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { status: 'approved' } });
    res.status(200).json({ message: "Approved products", data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { status: 'pending' } });
    res.status(200).json({ message: "Pending products", data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

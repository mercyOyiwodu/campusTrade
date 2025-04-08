const Seller = require('../models/seller')
const Admin =require('../models/admin')
 //is the model routing correcting since i am importing seller and product models
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const { toPascalCase } = require('../utils/stringHelpers');

// Admin registration (only accessible to super_admin)
exports.createAdmin = async (req, res) => {
  try {
    // Check if request is from a super_admin
    if (req.admin.isSuperAdmin !== true) {
      return res.status(403).json({
        message: 'Only super admins can create new admin accounts'
      });
    }
    
    const { fullName, email, password, isAdmin } = req.body;
    
    const adminExists = await Admin.findOne({ 
      where: { email: email.toLowerCase() } 
    });

    if (adminExists) {
      return res.status(400).json({
        message: `Admin with this email: ${email} already exists`
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newAdmin = await Admin.create({
      fullName: toPascalCase(fullName),
      email: email.toLowerCase(),
      password: hashedPassword,
      isAdmin
    });
    
    // Remove password from response
    const adminData = newAdmin.toJSON();
    delete adminData.password;
    
    res.status(201).json({
      message: 'Admin account created successfully',
      data: adminData
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error: " + error.message
    });
  }
};

exports.makeSuperAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the admin and confirm if they exist
        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({
                message: 'Admin not found'
            });
        }
        
        if (admin.isSuperAdmin === true) {
            return res.status(400).json({
                message: 'Admin is already a Super Admin'
            });
        }
        
        admin.isSuperAdmin = true;
        await admin.save(); // Save the changes to the database
        
        // Response success
        res.status(200).json({
            message: `Admin: ${admin.fullName} is now a Super Admin`
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error: ' + error.message
        });
    }
};

// Admin login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const newAdmin = await Admin.findOne({ 
      where: { email: email.toLowerCase() } 
    });

    if (!newAdmin) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, newAdmin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }
    // i need help with this token.the one on seller is it correct?

    // To distinguish admin from seller tokens
    const token = JWT.sign({ id: newAdmin.id, type: 'admin', isAdmin: newAdmin.isAdmin, isSuperAdmin: newAdmin.isSuperAdmin }, process.env.JWT_SECRET, { expiresIn: '24h' }
    );
    
    // Remove password from response
    const adminData = newAdmin.toJSON();
    delete adminData.password;
    
    res.status(200).json({
      message: 'Login successful',
      token,
      data: adminData
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error: " + error.message
    });
  }
};

exports.verifySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    const seller = await Seller.findByPk(sellerId);
    
    if (!seller) {
      return res.status(404).json({
        message: 'Seller not found'
      });
    }
    
    await seller.update({
      isVerified: true,
      verifiedBy: req.admin.id,
      verifiedAt: new Date()
    });
    
    res.status(200).json({
      message: 'Seller verified successfully',
      data: seller
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error: " + error.message
    });
  }
};

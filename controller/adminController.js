const Seller = require('../models/seller')
const Admin = require('../models/admin')
 //is the model routing correcting since i am importing seller and product models
const bcrypt = require('bcryptjs');
const {sendEmail} = require('../utils/nodemailer');
const signUpTemplate = require('../utils/signUp');
const JWT = require('jsonwebtoken');
const { toPascalCase } = require('../utils/stringHelpers');

// Admin registration (only accessible to super_admin)
exports.createAdmin = async (req, res) => {
  try {

    // Check if request is from a super_admin
    const {email, fullName, password, confirmPassword} = req.body;
            
            // Validate required fields
            if (!email || !fullName || !password || !confirmPassword) {
                return res.status(400).json({
                    message: 'Email, fullName and password are required'
                });
            }
    
            if(password !== confirmPassword){
            return res.status(400).json({
            message: "password does not match"
            })
            }
    
    const adminExists = await Admin.findOne({ where: { email: email.toLowerCase() }});
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

    });
    
// Generate a token
const token = JWT.sign({ id: newAdmin.id}, process.env.JWT_SECRET, { expiresIn: '30mins' });
    
// Create the verify link with the token generated
const link = `${req.protocol}://${req.get('host')}/api/v1/verify-admin/${token}`;
const firstName =  newAdmin.fullName.split(' ')[0] 

// Create the email details
const mailDetails = {
    to: newAdmin.email,
    subject: 'Welcome to Campus Trade',
    html: signUpTemplate(link, firstName)
};

// Send the verification email
await sendEmail(mailDetails);

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


exports.verifyAdmin = async (req, res) => {
  try {
      if (req.body.fullName) {
          req.body.fullName = toPascalCase(req.body.fullName);
        }
      const { token } = req.params;
      // verify the token
      await JWT.verify(token, process.env.JWT_SECRET, async (error, payload) => {
          if (error) {
              // check if error is jwt expires error
              if (error instanceof JWT.TokenExpiredError) {
                  const decodedToken = await JWT.decode(token);
                  // check for the seller/user
                  const admin = await Admin.findByPk(decodedToken.id);
                  if (admin == null) {
                      return res.status(400).json({
                          message: 'Admin not found'
                      });
                  }
                  // check if the seller/user has already been verified
                  if (admin.isVerified === true) {
                      return res.status(400).json({
                          message: 'Admin already verified, please login'
                      });
                  }

                  // generate a new token
                  const newToken = await JWT.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '3mins' });

                  // dynamically create the link
                  const link = `${req.protocol}://${req.get('host')}/api/v1/verify-admin/${newToken}`;
                  // get the user's first name
                  const firstName = admin.fullName.split(' ')[0];
                  // create the email details
                  const mailDetails = {
                      email: admin.email,
                      subject: 'Email verification',
                      html: signUpTemplate(link, firstName)
                  };
                  // await nodemailer to send the email
                  await sendEmail(mailDetails);
                  // send a success response
                  res.status(200).json({
                      message: "Link expired: A new verification link was sent, please check your email"
                  });
              }
          } else {
              console.log(payload);
              // find the seller/user in the database
              const admin = await Admin.findByPk(payload.id);
              // check if user exists
              if (!admin) {
                  return res.status(404).json({
                      message: 'Admin not found'
                  });
              }
              // check if the user has already been verified
              if (admin.isVerified === true) {
                  return res.status(400).json({
                      message: 'Admin has already been verified, please login'
                  });
              }
              // verify the user account
              admin.isVerified = true;
              // save the changes to the database
              await admin.save();
              // send a success response
              res.status(200).json({
                  message: "Account verified successfully"
              });
          }
      });
  } catch (error) {
      return res.status(500).json({
          message: "Internal server error"  + ' ' + error.message
      });
  }
};




// Admin login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    
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
    const token = JWT.sign({ id: newAdmin.id, type: 'admin', isAdmin: newAdmin.isAdmin}, process.env.JWT_SECRET, { expiresIn: '24h' }
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

    const adminId = req.admin.id;
    
    const seller = await Seller.findByPk(sellerId);
    
    if (!seller) {
      return res.status(404).json({
        message: 'Seller not found'
      });
    }
    
    await seller.update({
      isVerified: true,
      verifiedBy: req.admin.id,
      verifiedAt: new Date(),
      
    },
    { where: { id: sellerId } });
    
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


// exports.getPendingSellers = async (req, res) => {
//   try {
//     const pendingSellers = await Seller.findAll({
//       where: { isVerified: false }
//     });
    
//     res.status(200).json({
//       message: 'Pending sellers retrieved successfully',
//       count: pendingSellers.length,
//       data: pendingSellers
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Internal Server Error: " + error.message
//     });
//   }
// };


// // // Approve or reject a product
// exports.reviewProduct = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { status, feedback } = req.body;
    
//     if (!['approved', 'rejected'].includes(status)) {
//       return res.status(400).json({
//         message: 'Status must be either "approved" or "rejected"'
//       });
//     }
//     const product = await Product.findByPk(productId);
//     if (!product) {
//       return res.status(404).json({
//         message: 'Product not found'
//       });
//     }
    
//     // Update the product status
//     await product.update({
//       approvalStatus: status,
//       isApproved: status === 'approved',
//       isVerified: status === 'approved',
//       adminFeedback: feedback || null,
//       approvedBy: req.admin.id,
//       approvedAt: new Date()
//     });
    
//     res.status(200).json({
//       message: `Product ${status} successfully`,
//       data: product
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Internal Server Error: " + error.message
//     });
//   }
// };

// // Get pending product approvals
// exports.getPendingProducts = async (req, res) => {
//   try {
//     const pendingProducts = await Product.findAll({
//       where: { approvalStatus: 'pending' },
//       include: [
//         {
//           model: Seller,
//           as: 'seller',
//           attributes: ['fullName', 'email']
//         }
//       ]
//     });
    
//     res.status(200).json({
//       message: 'Pending products retrieved successfully',
//       count: pendingProducts.length,
//       data: pendingProducts
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Internal Server Error: " + error.message
//     });
//   }
// };


// // Get admin dashboard stats
// exports.getDashboardStats = async (req, res) => {
//   try {
//     const totalProducts = await Product.count();
//     const pendingProducts = await Product.count({ where: { approvalStatus: 'pending' } });
//     const approvedProducts = await Product.count({ where: { approvalStatus: 'approved' } });
//     const rejectedProducts = await Product.count({ where: { approvalStatus: 'rejected' } });
//     const totalSellers = await Seller.count();
//     const totalBuyers = await Buyer.count();
    
//     res.status(200).json({
//       message: 'Dashboard stats retrieved successfully',
//       data: {
//         products: {
//           total: totalProducts,
//           pending: pendingProducts,
//           approved: approvedProducts,
//           rejected: rejectedProducts
//         },
//         users: {
//           sellers: totalSellers,
//           buyers: totalBuyers
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Internal Server Error: " + error.message
//     });
//   }
// };


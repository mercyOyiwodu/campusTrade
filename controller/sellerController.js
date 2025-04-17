const Seller = require('../models/seller');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const { sendEmail } = require('../utils/nodemailer');
const signUpTemplate = require('../utils/signUp');
const forgotTemplate = require('../utils/signUp')
const fs = require('fs');

exports.register = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        // Validate required fields
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Passwords do not match'
            });
        }

        const sellerExists = await Seller.findOne({ where: { email: email.toLowerCase() } });
        if (sellerExists) {
            return res.status(400).json({
                message: `An account with ${email} already exists`
            });
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create seller
        const seller = await Seller.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            isloggedIn: false,
        });

        // Generate JWT token
        const token = JWT.sign({ sellerId: seller.id }, process.env.JWT_SECRET, { expiresIn: '30mins' });

        // Create verification link
        const link = `${req.protocol}://${req.get('host')}/api/v1/seller/verify-user/${token}`;

        // Email details
        const mailDetails = {
            email: seller.email,
            subject: 'Welcome to Campus Trade',
            html: signUpTemplate(link, 'User'),
        };

        await sendEmail(mailDetails);

        const sellerData = seller.toJSON();
        delete sellerData.password;

        return res.status(201).json({
            message: 'Account created! Please check your email to verify it.',
            data: sellerData,
            token
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong. Please try again later.' + error.message
        });
    }
};


exports.verify = async (req, res) => {
    try {
        const { token } = req.params;
        // verify the token
        await JWT.verify(token, process.env.JWT_SECRET, async (error, payload) => {
            if (error) {
                // check if error is jwt expires error
                if (error instanceof JWT.TokenExpiredError) {
                    const decodedToken = await JWT.decode(token);
                    // check for the seller/user
                    const seller = await Seller.findByPk(decodedToken.sellerId);
                    if (seller == null) {
                        return res.status(400).json({
                            message: 'Seller not found'
                        });
                    }
                    // check if the seller/user has already been verified
                    if (seller.isVerified === true) {
                        return res.status(400).json({
                            message: 'Seller already verified, please login'
                        });
                    }

                    // generate a new token
                    const newToken = await JWT.sign({ sellerId: seller.id }, process.env.JWT_SECRET, { expiresIn: '3mins' });

                    // dynamically create the link
                    const link = `${req.protocol}://${req.get('host')}/api/v1/verify-user/${newToken}`;
                    // create the email details
                    const mailDetails = {
                        email: seller.email,
                        subject: 'Email verification',
                        html: signUpTemplate(link, 'seller')
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
                const seller = await Seller.findByPk(payload.sellerId);
                // check if user exists
                if (seller === null) {
                    return res.status(404).json({
                        message: 'Seller not found'
                    });
                }
                // check if the user has already been verified
                if (seller.isVerified === true) {
                    return res.status(400).json({
                        message: 'Seller has already been verified, please login'
                    });
                }
                // verify the user account
                seller.isVerified = true;
                // save the changes to the database
                await seller.save();
                // send a success response
                res.status(200).json({
                    message: "Account verified successfully"
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        // Get the email from the request body
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: 'Please input your email'
            })
        }

        //  Check for the user
        const seller = await Seller.findOne({ where: { email: email.toLowerCase() } });
        if (!seller) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
       
        // Generate a token for the user
        const token = await JWT.sign({ sellerId: seller.id }, process.env.JWT_SECRET, { expiresIn: '30mins' });
        // Create the reset link
        const link = `${req.protocol}://${req.get('host')}/api/v1/seller/forget/${token}`;
        // const firstName = seller.fullName.split(' ')[0];
        // configure the email details
        
        const mailDetails = {
            subject: 'Password Reset',
            email: seller.email,
            html: forgotTemplate(link, 'User')
        }
        
        // Await nodemailer to send the user an email
        await sendEmail(mailDetails);
        
        // Send a success response
        res.status(200).json({
            message: 'Password reset initiated, Please check your email for the reset link',
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: error.message
        })
    }
};

exports.resetPassword = async (req, res) => {
    try {
        // Extract the token from the params
        const { token } = req.params;
        // Extract the passwod and confirm password from the request body
        const { password } = req.body;
        // Verify if the token is still valid
        const { sellerId } = await JWT.verify(token, process.env.JWT_SECRET);
        // Check if the user is still existsing
        const seller = await Seller.findByPk(sellerId);
        if (!seller) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Update the user's password to the new password
        seller.password = hashedPassword;
        await seller.save();
        // Send a success response
        res.status(200).json({
            message: 'Password reset successful'
        })

    } catch (error) {
        console.log(error.message)
        if (error instanceof JWT.JsonWebTokenError) {
            res.status(400).json({
                message: 'Link expired, Please initiate a link'
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: 'Please enter email and password' });
      }
  
      const seller = await Seller.findOne({ where: { email: email.toLowerCase() } });
  
      if (!seller) {
        return res.status(400).json({ message: 'Seller not found' });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, seller.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      if (!seller.isVerified) {
        return res.status(400).json({
          message: 'Seller not verified, please check your email to verify'
        });
      }
  
  
      const token = await JWT.sign(
        { sellerId: seller.id, isAdmin: seller.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '5mins' }
      );
  
      const sellerData = seller.get({ plain: true });
      delete sellerData.password;
      
      seller.isLoggedIn = true;
      await seller.save();
      
      res.status(200).json({
        message: 'Login successful',
        data: sellerData,
        token
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  exports.logOut = async (req, res) => {
    try {
        const sellerId = req.seller?.id;

        if (!sellerId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const seller = await Seller.findByPk(sellerId);
        if (!seller) {
            return res.status(404).json({ message: 'User not found' });
        }

        seller.isLoggedIn = false;
        await seller.save();

        res.status(200).json({ message: 'User logged out successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.changePassword = async (req, res) => {
    try {
        // Extract the token from the params
        const { token } = req.params;
        // Extract the passwod and confirm password from the request body
        const { password, confirmPassword } = req.body;
        // Verify if the token is still valid
        const { sellerId } = await JWT.verify(token, process.env.JWT_SECRET);
        // Check if the user is still existsing
        const seller = await Seller.findByPk(sellerId);
        if (!seller) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        // Confirm that the password matches
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Password does not match'
            })
        }
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Update the user's password to the new password
        seller.password = hashedPassword;
        await seller.save()
        res.status(200).json({
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });
    }

}                                                                                                                                                                                                     // // In sellerController.js
exports.getSellerDashboard = async (req, res) => {
    try {
        const sellerId = req.seller.id;

        const totalProducts = await Product.count({ where: { sellerId } });
        const pendingProducts = await Product.count({
            where: {
                sellerId,
                approvalStatus: 'pending'
            }
        });
        const approvedProducts = await Product.count({
            where: {
                sellerId,
                approvalStatus: 'approved'
            }
        });

        res.status(200).json({
            message: 'Dashboard data retrieved successfully',
            data: {
                products: {
                    total: totalProducts,
                    pending: pendingProducts,
                    approved: approvedProducts
                },
                verificationStatus: req.seller.isVerified
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error: " + error.message
        });
    }
};


exports.getAll = async (req, res) => {
    try {
        const getSellers = await Seller.findAll();
        res.status(200).json({
            message: 'All registered seller in the platform',
            data: getSellers,
            total: getSellers.length
        })

    } catch (error) {
        console.log(error)

        return res.status(500).json({
            message: 'Internal server error'+ error.message
        })
    }
}
exports.searchSellers = async (req, res) => {
    try {
        const { school } = req.query;

        let query = {};

        if (school) {
            query.school = school;
        }

        const sellers = await Seller.findAll({ where: query });

        return res.status(200).json(sellers);
    } catch (error) {
        return res.status(500).json({
            message: 'Error serching for sellers' + ' ' + error.message
        })
    }
}


exports.deleteSeller = async (req, res) => {
    try {
        const { id } = req.params;
        const seller = await Seller.findByPk(id);

        if (!seller) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        const oldFilePaths = seller.profilePic.map((e) => { return `./uploads/${e}` })
        const deleteuser = await Seller.destroy(id)

        if (deleteuser) {
            oldFilePaths.forEach((path) => {
                if (fs.existsSync(path)) {
                    fs.unlinkSync(path)
                }
            })
        }
        res.status(201).json({
            message: 'user deleted successfully'

        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

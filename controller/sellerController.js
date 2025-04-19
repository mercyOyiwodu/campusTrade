const JWT = require('jsonwebtoken');
const { sendEmail } = require('../utils/nodemailer');
const signUpTemplate = require('../utils/signUp');
const forgotTemplate = require('../utils/signUp');
const fs = require('fs');
const Product = require('../models/product');
const { Op } = require("sequelize");
const verificationLink = process.env.FRONTEND_URL;
const reset = process.env.RESET_PASSWORD
const Seller = require('../models/seller')
const bcrypt = require('bcryptjs');


exports.register = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        // Validate required fields
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
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

        // // Create verification link
        // const link = `${verificationLink}/api/v1/seller/verify-user/${token}`;
        const link = `${req.protocol}://campus-trade-h7bq.vercel.app/verification/${token}`
        const mailDetails = {
            email: seller.email,
            subject: "Verify your CampusTrade account" + "Please verify your email by clicking the link below",
            html: signUpTemplate(link, 'seller'),
        };

        await sendEmail(mailDetails);

        const sellerData = seller.toJSON();
        delete sellerData.password;

        return res.status(201).json({
            message: 'Account created! Please check your email to verify it.',
            data: sellerData,

        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};


// exports.verify = async (req, res) => {
//     try {
//         const { token } = req.params;
//         // verify the token
//         await JWT.verify(token, process.env.JWT_SECRET, async (error, payload) => {
//             if (error) {
//                 // check if error is jwt expires error
//                 if (error instanceof JWT.TokenExpiredError) {
//                     const decodedToken = await JWT.decode(token);
//                     // check for the seller/user
//                     const seller = await Seller.findByPk(decodedToken.sellerId);
//                     if (seller == null) {
//                         return res.status(400).json({
//                             message: 'Seller not found'
//                         });
//                     }
//                     // check if the seller/user has already been verified
//                     if (seller.isVerified === true) {
//                         return res.status(400).json({
//                             message: 'Seller already verified, please login'
//                         });
//                     }

//                     // generate a new token
//                     const newToken = await JWT.sign({ sellerId: seller.id }, process.env.JWT_SECRET, { expiresIn: '3mins' });

//                     // dynamically create the link
//                     const link = `${verificationLink}/${newToken}`;
//                     const mailDetails = {
//                         email: seller.email,
//                         subject: "Verify your CampusTrade account" + "Please verify your email by clicking the link below",
//                         html: signUpTemplate(link, 'seller'),
//                     };
//                     // await nodemailer to send the email
//                     await sendEmail(mailDetails);
//                     // send a success response
//                     res.status(200).json({
//                         message: "Link expired: A new verification link was sent, please check your email"
//                     });
//                 }
//             } else {
//                 console.log(payload);
//                 // find the seller/user in the database
//                 const seller = await Seller.findByPk(payload.sellerId);
//                 // check if user exists
//                 if (seller === null) {
//                     return res.status(404).json({
//                         message: 'Seller not found'
//                     });
//                 }
//                 // check if the user has already been verified
//                 if (seller.isVerified === true) {
//                     return res.status(400).json({
//                         message: 'Seller has already been verified, please login'
//                     });
//                 }
//                 // verify the user account
//                 seller.isVerified = true;
//                 console.log(seller.isVerified)
//                 // save the changes to the database
//                 await seller.save();
//                 // send a success response
//                 res.status(200).json({
//                     message: "Account verified successfully"
//                 });
//             }
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: error.message
//         });
//     }
// };

// exports.verify = async (req, res) => {
//     try {
//       const { token } = req.params;

//       let payload;
//       try {
//         payload = JWT.verify(token, process.env.JWT_SECRET);
//       } catch (error) {
//         if (error instanceof JWT.TokenExpiredError) {
//           const decodedToken = JWT.decode(token);
//           const seller = await Seller.findByPk(decodedToken.sellerId);

//           if (!seller) {
//             return res.status(400).json({ message: 'Seller not found' });
//           }

//           if (seller.isVerified) {
//             return res.status(400).json({ message: 'Seller already verified, please login' });
//           }

//           const newToken = JWT.sign(
//             { sellerId: seller.id },
//             process.env.JWT_SECRET,
//             { expiresIn: '3m' }
//           );

//           const link = `${verificationLink}/${newToken}`;
//           const mailDetails = {
//             email: seller.email,
//             subject: "Verify your CampusTrade account",
//             html: signUpTemplate(link, 'seller'),
//           };

//           await sendEmail(mailDetails);
//           return res.status(200).json({
//             message: 'Link expired: A new verification link has been sent to your email.',
//           });
//         }

//         // Other JWT errors
//         return res.status(400).json({ message: 'Invalid or malformed token.' });
//       }

//       // If token is valid
//       const seller = await Seller.findByPk(payload.sellerId);

//       if (!seller) {
//         return res.status(404).json({ message: 'Seller not found' });
//       }

//       if (seller.isVerified) {
//         return res.status(400).json({ message: 'Seller has already been verified, please login' });
//       }

//       seller.isVerified = true;
//       console.log("seller_verified" + seller.isVerified); // should be false
//       await seller.save();

//       const updatedSeller = await Seller.findByPk(seller.id);
//         console.log("updateSeller" + updatedSeller.isVerified); // should be true

//       res.status(200).json({ message: 'Account verified successfully' });

//     } catch (error) {
//       return res.status(500).json({ message: 'Server error: ' + error.message });
//     }
//   };



exports.verify = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(404).json({
                message: 'Token not found'
            })
        };

        JWT.verify(token, process.env.JWT_SECRET, async (error, payload) => {
            if (error) {
                if (error instanceof JWT.JsonWebTokenError) {
                    const { sellerId } = JWT.decode(token);
                    const seller = await Seller.findByPk(sellerId);

                    if (!seller) {
                        return res.status(404).json({
                            message: 'Seller not found'
                        })
                    };

                    const link = `${req.protocol}://campus-trade-h7bq.vercel.app/verification/${token}`
                    const mailDetails = {
                        email: seller.email,
                        subject: "Verify your CampusTrade account" + "Please verify your email by clicking the link below",
                        html: signUpTemplate(link, 'seller'),
                    };
                    await sendEmail(mailDetails);
                    res.status(200).json({
                        message: 'Verification sent to email'
                    })
                }
            } else {
                const seller = await Seller.findByPk(payload.sellerId);
                console.log(seller);
                console.log(seller.isVerified);
                
                
                if (!seller) {
                    return res.status(404).json({
                        message: 'Seller not found'
                    })
                };
                
                seller.isVerified = true;
                console.log(seller.isVerified);
                await seller.save();
                res.status(200).json({
                    message: 'Email verified successfully'
                })
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
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
        const link = `${reset}/${token}`;
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
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Passwords do not match'
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

        if (seller.isVerified === false) {
            const token = JWT.sign({ sellerId: seller.id }, process.env.JWT_SECRET, { expiresIn: '30mins' });

            // // Create verification link
            const link = `${verificationLink}/${token}`;
            const mailDetails = {
                email: seller.email,
                subject: "Verify your CampusTrade account" + "Please verify your email by clicking the link below",
                html: signUpTemplate(link, 'seller'),
            };

            await sendEmail(mailDetails);
            return res.status(400).json({
                message: 'Not verified, please check your email to verify',
                token
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
        // Extract the password and confirm password from the request body
        const { password, confirmPassword } = req.body;

        // Verify if the token is still valid
        let sellerId;
        try {
            const decoded = await JWT.verify(token, process.env.JWT_SECRET);
            sellerId = decoded.sellerId;
        } catch (error) {
            return res.status(400).json({
                message: 'Invalid or expired token'
            });
        }

        // Check if the user exists
        const seller = await Seller.findByPk(sellerId);
        if (!seller) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Confirm that the passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Passwords do not match'
            });
        }

        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the user's password
        seller.password = hashedPassword;
        await seller.save();

        // Return success message
        res.status(200).json({
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'An error occurred while updating the password.' + error.message
        });
    }
};



exports.getDashboardStats = async (req, res) => {

    try {
        const { sellerId } = req.params;

        // Basic validation example
        if (!sellerId || typeof sellerId !== 'string') {
            return res.status(400).json({ message: 'Invalid sellerId' });
        }

        const totalProducts = await Product.count({ where: { sellerId } });
        const pendingProducts = await Product.count({ where: { sellerId, approvalStatus: 'pending' } });
        const approvedProducts = await Product.count({ where: { sellerId, approvalStatus: 'approved' } });

        res.status(200).json({
            message: 'Dashboard stats retrieved successfully',
            data: {
                totalProducts,
                pendingProducts,
                approvedProducts
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error); // Logging the error
        res.status(500).json({ message: "Internal Server Error: " + error.message });
    }
};
exports.getRecentPosts = async (req, res) => {
    try {
        const sellerId = req.seller.id;
        const recentPosts = await Product.findAll({
            where: { sellerId },
            order: [['createdAt', 'DESC']],
            limit: 5
        });

        res.status(200).json({ message: 'Recent posts retrieved', data: recentPosts });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error: " + error.message });
    }
};

exports.getPendingPosts = async (req, res) => {
    try {
        const sellerId = req.seller.id;
        const pendingPosts = await Product.findAll({
            where: { sellerId, approvalStatus: 'pending' }
        });

        res.status(200).json({ message: 'Pending posts retrieved', data: pendingPosts });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error: " + error.message });
    }
};

exports.getApprovedPosts = async (req, res) => {
    try {
        const sellerId = req.seller.id;
        const approvedPosts = await Product.findAll({
            where: { sellerId, approvalStatus: 'approved' }
        });

        res.status(200).json({ message: 'Approved posts retrieved', data: approvedPosts });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error: " + error.message });
    }
};

exports.getWeeklyCategoryUploadStats = async (req, res) => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const categoryCounts = await Product.findAll({
            where: {
                approvalStatus: 'approved',
                createdAt: { [Op.gte]: oneWeekAgo }
            },
            attributes: ['categoryId', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            group: ['categoryId'],
            raw: true
        });

        const total = categoryCounts.reduce((sum, item) => sum + parseInt(item.count), 0);
        const categories = await Category.findAll({ attributes: ['id', 'categoryName'], raw: true });

        const result = categoryCounts.map(cat => {
            const category = categories.find(c => c.id === cat.categoryId);
            return {
                category: category ? category.categoryName : 'Unknown',
                percentage: Math.round((cat.count / total) * 100)
            };
        });

        res.status(200).json({
            message: 'Weekly category upload stats retrieved successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error: " + error.message });
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
            message: 'Internal server error' + error.message
        })
    }
}



exports.getSellerById = async (req, res) => {
    try {
        const { id } = req.params;
        const seller = await Seller.findByPk(id);

        if (!seller) {
            return res.status(400).json({
                message: 'Seller id is required'
            });
        }

        const allSeller = await Seller.findOne({ where: { id } });

        return res.status(200).json({
            message: 'Seller found',
            data: allSeller
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error getting seller ' + ' ' + error.message
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

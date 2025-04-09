const Seller = require('../models/seller');
const bcrypt = require('bcryptjs');
const { toPascalCase } = require('../utils/stringHelpers')
const cloudinary = require('../config/cloudinary');
const JWT = require('jsonwebtoken');
const sendEmail = require('../utils/nodemailer');
const {signUpTemplate, forgotTemplate} = require('../utils/signUp');
const fs = require('fs');


exports.register = async(req, res) => {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                message: 'Profile image is required'
            });
        }

        if (req.body.fullName) {
            req.body.fullName = toPascalCase(req.body.fullName);
        }
        
        const {email, fullName, password, confirmPassword} = req.body;
        
        // Validate required fields
        if (!email || !fullName || !password || !confirmPassword) {
            // Unlink the file from our local storage
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: 'Email, fullName and password are required'
            });
        }

        if(password !== confirmPassword){
        return res.status(400).json({
        message: "password does not match"
        })
        }

        const sellerExists = await Seller.findOne({ where: { email: email.toLowerCase() } });
        if (sellerExists) {
            // Unlink the file from our local storage
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: `Seller with email: ${email} already exists`
            });
        }

        
        // Encrypt the user's password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
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


        // Create the user details
        const seller = await Seller.create({
            fullName,
            password: hashedPassword,
            email: email.toLowerCase(),
            profilePic: result.secure_url,
        });
        
        // Generate a token
        const token = JWT.sign({ sellerId: seller.id}, process.env.JWT_SECRET, { expiresIn: '30mins' });
    
        // Create the verify link with the token generated
        const link = `${req.protocol}://${req.get('host')}/api/v1/verify-user/${token}`;
        const firstName = seller.fullName.split(' ')[0];
        
        // Create the email details
        const mailDetails = {
            email: seller.email,
            subject: 'Welcome to Campus Trade',
            html: signUpTemplate(link, firstName)
        };
        
        // Send the verification email
        await sendEmail(mailDetails);
        
        // Remove password from response
        const sellerData = seller.toJSON();
        delete sellerData.password;
        
        // Send a success response
        res.status(201).json({
            message: 'Seller created successfully. Please check your email to verify your account.',
            data: sellerData
        });

    } catch (error) {
        // Clean up file if it exists and an error occurred
        // if (req.file && req.file.path) {
        //     try {
        //         fs.unlinkSync(req.file.path);
        //     } catch (unlinkError) {
        //         console.error('Error deleting file:', unlinkError);
        //     }
        // } 
        res.status(500).json({ 
            message: 'Error creating Seller: ' + error.message 
        });
    }
};

exports.verify = async (req, res) => {
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
                    // get the seller/user's first name
                    const firstName = seller.fullName.split(' ')[0];
                    // create the email details
                    const mailDetails = {
                        email: seller.email,
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
            message: "Internal server error"  + ' ' + error.message
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
        const seller = await Seller.findOne({ email: email.toLowerCase() });
        if (!seller) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        // Generate a token for the user
        const token = await JWT.sign({ sellerId: seller.id }, process.env.JWT_SECRET, { expiresIn: '10mins' });
        // Create the reset link
        const link = `${req.protocol}://${req.get('host')}/api/v1/initiate/recover/${token}`;
        const firstName = seller.fullName.split(' ')[0];
        // configure the email details
        const mailDetails = {
            subject: 'Password Reset',
            email: seller.email,
            html: forgotTemplate(link, firstName)
        }
        // Await nodemailer to send the user an email
        await sendEmail(mailDetails);

        // Send a success response
        res.status(200).json({
            message: 'Password reset initiated, Please check your email for the reset link'
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Internal Server Error'
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
            message: 'Internal Server Error'
        })
    }
}

exports.login = async (req, res)=>{
    try {
        // extract the user email's and password from the request body
        const  {email, password} = req.body;
        if (email == undefined || password == undefined){
            return res.status(400).json({
                message: 'Please enter email and password'
            });
        };
        //check for the user and throw an error if not found
        const seller = await Seller.findOne({email:email.toLowerCase() });
        if (seller == null ){
            return res.status(400).json({
                message: 'Seller not found'
            });
        };
        // check the password if it is correct
        const isPasswordCorrect = await bcrypt.compare(password, seller.password);
        if (isPasswordCorrect === false){
            return res.status(400).json({
                message: 'Invalid password'
            });
        };
        // generate  a token for the user
        const token = await JWT.sign({sellerId: seller.id, isAdmin: seller.isAdmin}, process.env.JWT_SECRET, {expiresIn: '5mins'});
        const {password:hashedPassword, ...data} = seller._doc
        //send response
        res.status(200).json({
            message:'Login successful',
            data,
            token
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

exports.logOut = async (req, res) => {
    try {
        const sellerExists = await Seller.findByPk(req.seller.sellerId);
        if (!sellerExists) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        sellerExists.isLoggedIn = false
        await sellerExists.save()
        res.status(200).json({
            message: 'user logged out successfully'
        })
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: 'Error Logging out User'
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { id } = req.params
        const { newPassword } = req.body
        const seller = await Seller.findByPk(id)
        if (!seller) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        const isMatch = bcrypt.compare(newPassword, seller.password)
        if (isMatch === null) {
            return res.status(400).json({
                message: 'current password is the same as formal one'
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        seller.password = hashedPassword

        res.status(200).json({
            message: 'Password updated successfully'
        });


    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Error changing password'
        });
    }

}
// exports.getAll = async (req, res)=>{
//     try {
//         const getSellers = await Seller.findAll();
//         res.status(200).json({
//             message: 'All registered seller in the platform',
//             data: getSellers,
//         })

//     } catch (error) {
//         return res.status(500).json({
//             message: 'Internal server error' + ' ' + error.message
//         })
//     }
// }

exports.updateSeller = async (req, res) => {
    try {
        // Get the ID from the params
        const { id } = req.params;
        // Extract the fields to be updated from the request body
        const { fullName, email } = req.body;

        const seller = await Seller.findByPk(id);
        if (!seller) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        // Create a data object
        const data = {
            fullName,
            email,
            profilePic: seller.profilePic
        };

        //   Dynamically declare each file path
        // Check if the user is uploading an image
        if (req.files && req.files[0]) {
            // Run a check for each of the file paths
            oldFilePaths.forEach((path) => {
                // Check if the paths are existing
                if (fs.existsSync(path)) {
                    // Delete the existing images
                    fs.unlinkSync(path)
                    //   Upload the new image and update the data object
                    const files = req.files.map((element) => element.filename);
                    data.profilePic = files

                }
            })

        }
        // Pass the updated data object to the database
        const updatedUser = await Seller.update(id, data, { new: true })
        // Send a success response
        res.status(201).json({
            message: 'Your information has been updated successfully',
            data: updatedUser
        })

    } catch (error) {
        res.status(500).json({
            message: 'Error updating seller: ' + error.message
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
        const deleteuser =await Seller.destroy(id)
        
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
        message: 'Internal Server Error ' + error.message 
       }) 
    }
}

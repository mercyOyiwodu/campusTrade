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
        const {jambRegNo, school, gender , whatsappLink, phoneNumber, fullName } = req.body;

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

exports.getSellerKyc = async (req, res) => {
    try {
        const { id: sellerId } = req.params;

        const seller = await Seller.findByPk(sellerId, {
            include: [
                {
                    model: SellerKYC,
                    as: 'SellerKYCs' 
                }
            ]
        });

        if (!seller) {
            return res.status(404).json({
                message: 'Seller not found'
            });
        }

        return res.status(200).json({
            message: 'Seller retrieved successfully',
            data: seller
        });

    } catch (error) {
        return res.status(500).json({
            message: 'There was an issue getting the user detail: ' + error.message 
        });
    }
};


exports.updateSellerKyc = async (req, res) => {
  try {
    const { id: sellerId } = req.params;      
    const { jambRegNo, school, gender, whatsappLink, phoneNumber, fullName } = req.body;

    const seller = await Seller.findByPk(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Grab the existing KYC row (must exist to edit)
    const kyc = await SellerKYC.findByPk(sellerId);
    if (!kyc) {
      return res.status(404).json({ message: 'KYC record not found' });
    }

    let newProfilePicUrl = kyc.profilePic;      
    if (req.file) {
      const upload = await cloudinary.uploader.upload(
        req.file.path,
        { resource_type: 'auto' }
      );
      fs.unlinkSync(req.file.path);            
      newProfilePicUrl = upload.secure_url;
    }

    await kyc.update({
      jambRegNo:     jambRegNo   ?? kyc.jambRegNo,
      school:        school      ?? kyc.school,
      gender:        gender      ?? kyc.gender,
      whatsappLink:  whatsappLink?? kyc.whatsappLink,
      phoneNumber:   phoneNumber ?? kyc.phoneNumber,
      fullName:      fullName ? toPascalCase(fullName) : kyc.fullName,
      profilePic:    newProfilePicUrl
    });

    return res.status(200).json({
      message: 'KYC updated successfully',
      data: kyc
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

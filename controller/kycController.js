const Seller = require('../models/seller');
const SellerKYC = require('../models/sellerkyc');

exports.profileDetails = async(req, res) =>{
    try {
        const {id:sellerId} = req.params;
        const {jambRegNo, description, school, location, connectLink, phoneNumber } = req.body;

        const userExists = await Seller.findByPk(sellerId);
        if(!userExists){
            res.status(404).json({
                message: "Seller not found"
            })
        }
        
        const data = {
            school,
            jambRegNo,
            location,
            id:sellerId,
            description,
            connectLink,
            phoneNumber
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
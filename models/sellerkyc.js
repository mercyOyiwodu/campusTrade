const mongoose = require("mongoose");

const sellerKycSchema = new mongoose.Schema(
  {
    jambRegNo: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    profilePic: {
      type: String,
      required: true,
    },
    whatsappLink: {
      type: String,
      default: null,
    },
    school: {
      type: String,
      enum: [
        "Lagos State University",
        "University Of Lagos",
        "Yaba College Of Technology",
      ],
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Female", "Male"],
      default: "Male",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller", // relation to Seller model
      required: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

const SellerKYC = mongoose.model("SellerKYC", sellerKycSchema);
module.exports = SellerKYC;



// const { Sequelize, DataTypes, Model } = require('sequelize');
// const sequelize = require('../database/sequelize');
// const Seller = require('../models/seller')
// class SellerKYC extends Model {}

// SellerKYC.init(
//   {
//     id: {
//       allowNull: false,
//       primaryKey: true,
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4
//     },
//     jambRegNo: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     fullName: {
//           type: DataTypes.STRING,
//           allowNull: false,
//         },
//         profilePic:{
//           type: DataTypes.STRING,
//           allowNull:false
//         },
//     whatsappLink: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       defaultValue: true
//     },
//     school: {
//       type: DataTypes.ENUM('Lagos State University', 'University Of Lagos', 'Yaba College Of Technology')
//     },
//     phoneNumber: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     gender: {
//       type:DataTypes.ENUM('Female', 'Male'),
//     defaultValue: 'Male'
//    },
//     createdAt: {
//       allowNull: false,
//       type: DataTypes.DATE
//     },
//     updatedAt: {
//       allowNull: false,
//       type: DataTypes.DATE
//     }
//   },
//   {
//     // Other model options go here
//     sequelize, // We need to pass the connection instance
//     modelName: 'SellerKYC', 
//     tableName: 'SellerKYCs'
//   },
// );


// SellerKYC.belongsTo(Seller, {foreignKey: 'id', as: 'sellers'});
// Seller.hasOne(SellerKYC, { foreignKey: 'id', as: 'SellerKYCs' });


// module.exports= SellerKYC
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // emails should be unique for admins
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;





// const { Sequelize, DataTypes, Model } = require('sequelize');
// const sequelize = require('../database/sequelize');
// const Seller = require('../models/seller');

// class Admin extends Model {}

// Admin.init(
//   {
//     id: {
//       allowNull: false,
//       primaryKey: true,
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull:false
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull:false
//     },
//     isAdmin: {
//       type:DataTypes.BOOLEAN,
//       defaultValue:false,
//     },
//     isVerified:{
//       type:DataTypes.BOOLEAN,
//       defaultValue:false
//     },
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
//     modelName: 'Admin', 
//     tableName: 'Admins'
//   },
// );


// module.exports= Admin
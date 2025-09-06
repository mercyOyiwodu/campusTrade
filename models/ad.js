const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false, // optional like Sequelize `allowNull: true`
    },
    image: {
      type: String,
      required: true, // Sequelize `allowNull: false`
    },
    description: {
      type: String, // Sequelize `TEXT` maps to String in MongoDB
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // ⬅️ replaces `createdAt` & `updatedAt`
  }
);

const Ad = mongoose.model("Ad", adSchema);
module.exports = Ad;




// const { Sequelize, DataTypes, Model } = require('sequelize');
// const sequelize = require('../database/sequelize');
// const Admin = require('./admin');

// class Ad extends Model {}

// Ad.init(
//   {
//     id: {
//       allowNull: false,
//       primaryKey: true,
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4
//     },
//     title: {
//       type: DataTypes.STRING,
//       allowNull: true
//     },
//     image: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: true
//     },
//     date: {
//       type:DataTypes.DATE,
//       allowNull:false
//     },
//     expiresAt: {
//       type: DataTypes.DATE,
//       allowNull: false
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
//     sequelize,
//     modelName: 'Ad',
//     tableName: 'Ads'
//   }
// );

// module.exports = Ad;

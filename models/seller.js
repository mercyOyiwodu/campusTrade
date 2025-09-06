const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    isVerified: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true, // each seller should have a unique email
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // references Admin who verified
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller





// const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
// const sequelize = require('../database/sequelize');
// const Admin = require('./admin');

// class Seller extends Model {}

// Seller.init(
//   {
//     id: {
//       allowNull: false,
//       primaryKey: true,
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4
//     },
//     isVerified:{
//       type:DataTypes.BOOLEAN,
//       defaultValue:false
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     }, 
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     createdAt: {
//       allowNull: false,
//       type: DataTypes.DATE
//     },
//     isLoggedIn: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false
//     },
//     verifiedBy: {
//       type: DataTypes.UUID,
//       allowNull: true,
//       references: {
//         model: 'Admin',
//         key: 'id'
//       },
//       onDelete: 'CASCADE',
//       onUpdate: 'CASCADE'
//     },
//     verifiedAt: {
//       type: DataTypes.DATE,
//       allowNull: true
//     },
//     updatedAt: {
//       allowNull: false,
//       type: DataTypes.DATE
//     }
//   },
//   {
//     // Other model options go here
//     sequelize, // We need to pass the connection instance
//     modelName: 'seller', 
//     tableName: 'sellers'
//   },
// );

//   // Seller.belongsTo(Admin, {foreignKey: 'id', as: 'admins'});
//   // Admin.hasMany(Seller, { foreignKey: 'id', as: 'seller' });



// module.exports= Seller
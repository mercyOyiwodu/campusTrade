const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../database/sequelize');

class SellerKYC extends Model {}

SellerKYC.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    jambRegNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fullName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        profilePic:{
          type: DataTypes.STRING,
          allowNull:false
        },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    whatsappLink: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: true
    },
    school: {
      type: DataTypes.ENUM('Lagos State University', 'University Of Lagos', 'Yaba College Of Technology'),
      defaultValue: 'Lagos State University',
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type:Sequelize.ENUM('Female', 'Male'),
    defaultValue: 'Male'
   },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'SellerKYC', 
    tableName: 'SellerKYCs'
  },
);

module.exports= SellerKYC
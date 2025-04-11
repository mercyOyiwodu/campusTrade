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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    connectLink: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: true
    },
    school: {
      type: DataTypes.ENUM('LASU', 'UNILAG', 'LAUTECH'),
      defaultValue: 'UNILAG',
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
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
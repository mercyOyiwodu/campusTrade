const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../database/sequelize');

class Buyer extends Model {}

Buyer.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4

    },
    fullName: {
      type: DataTypes.STRING,
      allowNull:false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull:false
    },
    email: {
      type: DataTypes.STRING,
      allowNull:false
    },
    // isVerified: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull:false
    // },
    // isAdmin: {
    //   type: DataTypes.BOOLEAN,

    // },
    // school: {
    //   type: DataTypes.STRING,
    //   allowNull:false
    // },
    location: {
      type: Sequelize.STRING,
      allowNull:false
    },
    password: {
      type: Sequelize.STRING,
      allowNull:false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Buyer', 
    tableName: 'Buyers'
  },
);

module.exports= Buyer
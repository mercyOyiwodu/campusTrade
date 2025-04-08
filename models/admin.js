const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/sequelize');
const Seller = require('../models/seller');

class Admin extends Model {}

Admin.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull:false
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false
    },
    isAdmin: {
      type:DataTypes.BOOLEAN,
      defaultValue:false,
    },
    isSuperAdmin:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    },
    sellerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Sellers", 
          key: "id",
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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
    modelName: 'Admin', 
    tableName: 'Admins'
  },
);


module.exports= Admin
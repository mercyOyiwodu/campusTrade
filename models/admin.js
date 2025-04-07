const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../database/sequelize');

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
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/sequelize');
const Admin = require('./admin');

class Ad extends Model {}

Ad.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
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
    sequelize,
    modelName: 'Ad',
    tableName: 'Ads'
  }
);

module.exports = Ad;

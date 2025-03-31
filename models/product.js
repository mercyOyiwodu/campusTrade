const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../database/sequelize');

class Product extends Model {}

Product.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4
    },
    price: {
      type: DataTypes.DECIMAL
    },
    detail: {
      type: DataTypes.STRING
    },
    category: {
      type: DataTypes.ARRAY
    },
    media: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sellerId: {
      type: DataTypes.UUID
    },
    timeCreated: {
      type: DataTypes.DATE
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Product', 
    tableName: 'Products'
  },
);

module.exports= Product

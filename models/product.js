const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../database/sequelize');

class Product extends Model {}

Product.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.ARRAY,
      allowNull: false
    },
    media: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Sellers", 
        key: "id",
      },
    },
    timeCreated: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {

    sequelize, 
    modelName: 'Product', 
    tableName: 'Products'
  },
);

module.exports= Product

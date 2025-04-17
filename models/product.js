const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../database/sequelize');
const Category = require('../models/category');
const Seller = require('../models/seller'); // Assuming you have a Seller model

class Product extends Model {}

Product.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    condition: {
      type: DataTypes.ENUM('Used', 'New'),
      defaultValue: 'Used'
    },
    media: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Sellers',
        key: 'id',
      },
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved','not_approved'),
      defaultValue: 'pending',
    },    
    isVerified:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    timeCreated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW, 
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
  }
);

Product.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

Product.belongsTo(Seller, { foreignKey: 'sellerId' }); 
Seller.hasMany(Product, { foreignKey: 'sellerId' }); 

module.exports = Product;

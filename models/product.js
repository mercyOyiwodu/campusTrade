const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../database/sequelize');
const Category = require('../models/category');
const Seller = require('../models/seller'); // Assuming you have a Seller model
const Subcategory = require('./subCategory');

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
    subCategoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'subcategories',
        key: 'id',
      },
    },
    school : {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved','not_approved'),
      defaultValue: 'pending',
    },    
    // isVerified:{
    //   type: DataTypes.BOOLEAN,
    //   allowNull: false,
    // },
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

Product.belongsTo(Subcategory, { foreignKey: 'subCategoryId' });
Subcategory.hasMany(Product, { foreignKey: 'productId' });

Product.belongsTo(Seller, { foreignKey: 'sellerId' }); 
Seller.hasMany(Product, { foreignKey: 'productId' }); 

module.exports = Product;

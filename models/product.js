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
      get() {
        const rawValue = this.getDataValue('media');
        return rawValue ? rawValue.split(',') : [];
      },
      set(value) {
        if (Array.isArray(value)) {
          this.setDataValue('media', value.join(','));
        } else {
          throw new Error('Media must be an array of strings');
        }
      },
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
        model: 'Subcategory',
        key: 'id',
      },
    },
    subCategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
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
Subcategory.hasMany(Product, { foreignKey: 'id' });

Product.belongsTo(Seller, { foreignKey: 'sellerId' }); 
Seller.hasMany(Product, { foreignKey: 'id' }); 

// Product.belongsTo(Category, { foreignKey: 'categoryId' }); 

module.exports = Product;

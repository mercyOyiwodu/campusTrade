const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../database/sequelize');
const Category = require('../models/category');

class Subcategory extends Model {}

Subcategory.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'Subcategory',
    tableName: 'Subcategories'
  }
);



// Associations
// SubCategory model
// Category model
 // Category model

 Category.hasMany(Subcategory, { 
  as: 'subCategories', 
  foreignKey: 'categoryId' 
});

Subcategory.belongsTo(Category, { 
  foreignKey: 'categoryId', 
  as: 'category' 
});

module.exports = Subcategory;

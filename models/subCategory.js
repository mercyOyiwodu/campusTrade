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
Subcategory.belongsTo(Category, { foreignKey: 'categoryId', as: 'parentCategory' });
Category.hasMany(Subcategory, { foreignKey: 'categoryId', as: 'subCategories' });

module.exports = Subcategory;

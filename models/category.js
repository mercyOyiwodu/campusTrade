const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../database/sequelize');

class Category extends Model {}

Category.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4
    },
    name: {
      type: DataTypes.STRING
    },
    parentCategoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Categories',
        key: 'id',
      },
    },
  },
  {

    sequelize, 
    modelName: 'Category', 
    tableName: 'Categories'
  },
);

Category.hasMany(Category, { foreignKey: 'parentCategoryId', as: 'subCategories' });
Category.belongsTo(Category, { foreignKey: 'parentCategoryId', as: 'parentCategory' });

module.exports= Category

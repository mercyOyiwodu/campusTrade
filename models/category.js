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
  },
  {

    sequelize, 
    modelName: 'Category', 
    tableName: 'Categories'
  },
);


module.exports= Category

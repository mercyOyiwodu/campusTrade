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
    title: {
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
    itemCondition:{
      type: DataTypes.ENUM('Used','New'),
      allowNull: false
    },
    availability: {
      type: DataTypes.ENUM('In Stock', 'Sold'),
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
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,  
        references: {
          model: 'Categories', 
          key: 'id',
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

Product.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

module.exports= Product

const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../database/sequelize');
const Admin = require('./admin');

class Seller extends Model {}

Seller.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isloggedIn:{
      type:DataTypes.BOOLEAN,
      allowNull:false
    },
    profilePic:{
      type: DataTypes.STRING,
      allowNull:false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    verifiedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Admin',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Seller', 
    tableName: 'Sellers'
  },
);

  Seller.belongsTo(Admin, {foreignKey: 'sellerId', as: 'admins'});
  Admin.hasMany(Seller, { foreignKey: 'sellerId', as: 'seller' });



module.exports= Seller
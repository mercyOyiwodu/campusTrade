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
  profilePic: {
    type: DataTypes.STRING,
    allowNull: true
  },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jambRegNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    connectLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    school: {
      type: DataTypes.ENUM('LASU', 'UNILAG', 'LAUTECH'),
      defaultValue: 'UNILAG',
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
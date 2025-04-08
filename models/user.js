const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../database/sequelize');

class User extends Model {}

User.init(
  {
    id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: UUIDV4
          },
          fullName: {
            type: DataTypes.STRING,
            allowNull: false
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false
          },
          isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false
          },
          phoneNumber: {
            type: DataTypes.NUMBER,
            allowNull: false
          },
  },
  {

    sequelize, 
    modelName: 'User', 
    tableName: 'Users'
  },
);

module.exports= User
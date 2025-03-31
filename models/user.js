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
            type: DataTypes.STRING
          },
          email: {
            type: DataTypes.STRING
          },
          password: {
            type: DataTypes.STRING
          },
          isVerified: {
            type: DataTypes.BOOLEAN
          },
          phoneNumber: {
            type: DataTypes.NUMBER
          },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'User', 
    tableName: 'Users'
  },
);

module.exports= User
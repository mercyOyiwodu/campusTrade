const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../database/sequelize');

class Transaction extends Model {}

Transaction.init(
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
  amount: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  email: {
      type: DataTypes.STRING,
      allowNull: false
  },
  reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
  },
  paymentDate: {
      type: DataTypes.STRING,
      allowNull: false
  },
  status: {
      type: DataTypes.ENUM('Pending', 'Success', 'Failed'),
      defaultValue: 'Pending',
  },
  purpose: {
      type: DataTypes.STRING,
      allowNull: false, // Identifying the purpose (post_fee, etc.)
  },
  used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Indicates if the transaction was used
  },
  sellerId: {
      type: DataTypes.UUID,
      allowNull: true, // Optional
  },
  createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'transaction', 
    tableName: 'transactions'
  },
);

module.exports= Transaction
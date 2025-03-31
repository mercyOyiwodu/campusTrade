const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
const sequelize = require('../database/sequelize');

class Transaction extends Model {}

Transaction.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
    },
    paidBy: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Seller',
        key: 'id',
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amountPaid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ref: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Successful', 'Failed'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },{
    sequelize,
    modelName: 'Transaction',
    tableName: 'Transactions',
  }
);

module.exports = Transaction;

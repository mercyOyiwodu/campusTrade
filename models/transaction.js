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
      allowNull: false, 
  },
  used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, 
  },
  productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Product',
        key: 'id',
      },
  },
  // sellerId: {
  //   type: DataTypes.UUID,
  //   allowNull: false,
  //   references: {
  //     model: 'Seller',
  //     key: 'id',
  //   },
  // },
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
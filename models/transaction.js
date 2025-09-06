const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    paymentDate: {
      type: String, // you might also consider Date type if it's an actual timestamp
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
    purpose: {
      type: String,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // relationship with Product model
      required: true,
    },
    // seller: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Seller",
    //   required: true,
    // },
  },
  {
    timestamps: true, // auto handles createdAt & updatedAt
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;




// const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
// const sequelize = require('../database/sequelize');

// class Transaction extends Model {}

// Transaction.init(
//   {
//     id: {
//       allowNull: false,
//       primaryKey: true,
//       type: DataTypes.UUID,
//       defaultValue: UUIDV4
//   },
//   name: {
//       type: DataTypes.STRING,
//       allowNull: false
//   },
//   amount: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//   },
//   email: {
//       type: DataTypes.STRING,
//       allowNull: false
//   },
//   reference: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true
//   },
//   paymentDate: {
//       type: DataTypes.STRING,
//       allowNull: false
//   },
//   status: {
//       type: DataTypes.ENUM('Pending', 'Success', 'Failed'),
//       defaultValue: 'Pending',
//   },
//   purpose: {
//       type: DataTypes.STRING,
//       allowNull: false, 
//   },
//   used: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false, 
//   },
//   productId: {
//       type: DataTypes.UUID,
//       allowNull: false,
//       references: {
//         model: 'Product',
//         key: 'id',
//       },
//   },
//   // sellerId: {
//   //   type: DataTypes.UUID,
//   //   allowNull: false,
//   //   references: {
//   //     model: 'Seller',
//   //     key: 'id',
//   //   },
//   // },
//   createdAt: {
//       allowNull: false,
//       type: DataTypes.DATE
//     },
//     updatedAt: {
//       allowNull: false,
//       type: DataTypes.DATE
//     }
//   },
//   {
//     // Other model options go here
//     sequelize, // We need to pass the connection instance
//     modelName: 'transaction', 
//     tableName: 'transactions'
//   },
// );

// module.exports= Transaction
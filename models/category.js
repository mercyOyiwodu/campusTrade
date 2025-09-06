const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // prevent duplicate category names
      trim: true,   // remove extra spaces
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;




// const { Sequelize, DataTypes, Model, UUIDV4 } = require('sequelize');
// const sequelize = require('../database/sequelize');

// class Category extends Model {}

// Category.init(
//   {
//     id: {
//       allowNull: false,
//       primaryKey: true,
//       type: DataTypes.UUID,
//       defaultValue: UUIDV4
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false
//     }
//   },
//   {
//     sequelize,
//     modelName: 'Category',
//     tableName: 'Categories'
//   }
// );

// module.exports = Category;

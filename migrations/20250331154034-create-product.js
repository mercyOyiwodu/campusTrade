'use strict';

const { UUIDV4 } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: UUIDV4,
        allowNull: false
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false, 
      },
      school: {
        type: Sequelize.STRING,
        allowNull: false,  
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      condition: {
        type: Sequelize.ENUM('Used',"New"),
        allowNull: false,
      },
      media: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sellerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Sellers", 
          key: "id",
        },
      },
        categoryId: {
          type: Sequelize.UUID,
          allowNull: false,  
          references: {
            model: 'Categories', 
            key: 'id',
          },
        },
      
      timeCreated: {
        type: Sequelize.DATE,
        allowNull: false
      },
       createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
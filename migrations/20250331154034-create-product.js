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
        defaultValue: UUIDV4
      },
      price: {
        type: Sequelize.DECIMAL
      },
      detail: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.ARRAY
      },
      media: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sellerId: {
        type: Sequelize.UUID
      },
      timeCreated: {
        type: Sequelize.DATE
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
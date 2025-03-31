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
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      detail: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category: {
        type: Sequelize.ARRAY,
        allowNull: false
      },
      media: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sellerId: {
        type: Sequelize.UUID,
        allowNull: false
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
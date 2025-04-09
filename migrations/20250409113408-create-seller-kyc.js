'use strict';

const { UUIDV4 } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SellerKYCs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue:UUIDV4
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      connectLink: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      school: {
            type: Sequelize.ENUM('LASU', 'UNILAG', 'LAUTECH'),
            defaultValue: 'UNILAG',
          },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jambRegNo: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
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
    await queryInterface.dropTable('SellerKYCs');
  }
};
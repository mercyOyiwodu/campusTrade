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
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profilePic:{
        type:Sequelize.STRING,
        allowNull:false
      },
      whatsappLink: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: true
      },
      school: {
            type: Sequelize.ENUM('Lagos State University', 'University Of Lagos', 'Yaba College Of Technology'),
            defaultValue: 'Lagos State University',
          },
      gender: {
        type:Sequelize.ENUM('Female', 'Male'),
      defaultValue: 'Male'
    },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jambRegNo: {
        type: Sequelize.INTEGER,
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
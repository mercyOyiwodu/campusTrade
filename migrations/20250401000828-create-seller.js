'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sellers', {
      id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue:Sequelize.UUIDV4
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          isVerified:{
          type:Sequelize.BOOLEAN,
          defaultValue:false
          },
          verifiedBy: {
            type: Sequelize.UUID,
            allowNull: true,
          },
          isLoggedIn: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          verifiedAt: {
            type: Sequelize.DATE,
            allowNull: true
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          createdAt: {
            allowNull: false,
            type:Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sellers');
  }
};
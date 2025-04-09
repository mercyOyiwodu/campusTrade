'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sellers', {
      id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue:Sequelize.UUIDV4
          },
          fullName: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          phoneNumber: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          profilePic:{
            type:Sequelize.STRING,
            allowNull:false
          },
          isloggedIn:{
            type:Sequelize.BOOLEAN,
            allowNull:false
          },
          isVerified:{
          type:Sequelize.BOOLEAN,
          defaultValue:false
          },
          verifiedBy: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'Admins', 
              key: 'id'
            }
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
    await queryInterface.dropTable('sellers');
  }
};
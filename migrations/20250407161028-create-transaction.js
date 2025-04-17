'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue:Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    amount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    reference: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    paymentDate: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('Pending', 'Success', 'Failed'),
        defaultValue: 'Pending',
    },
    purpose: {
        type: Sequelize.STRING,
        allowNull: false, // Identifying the purpose (post_fee, etc.)
    },
    used: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // Indicates if the transaction was used
    },
    sellerId: {
        type: Sequelize.UUID,
        allowNull: true, // Optional
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
    await queryInterface.dropTable('Transactions');
  }
};
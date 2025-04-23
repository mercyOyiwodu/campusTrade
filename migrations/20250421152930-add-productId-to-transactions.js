'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Transactions', 'productId', {
      type: Sequelize.UUID,
      allowNull: false,
      after: 'id'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Transactions', 'productId');
  }
};
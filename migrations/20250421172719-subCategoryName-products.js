'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'subCategoryName', {
      type: Sequelize.STRING,
      allowNull: false,
      after: 'id'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'subCategoryName');
  }
};
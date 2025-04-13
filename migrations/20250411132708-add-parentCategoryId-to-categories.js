'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Categories', 'parentCategoryId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Categories', // references the Categories table
        key: 'id'
      },
      onUpdate: 'CASCADE', // When the parent category ID is updated, this will cascade the change
      onDelete: 'SET NULL' // When the parent category is deleted, this will set the reference to null
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Categories', 'parentCategoryId');
  }
};

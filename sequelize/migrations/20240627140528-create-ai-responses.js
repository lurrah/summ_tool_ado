'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AiResponses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      IteratId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Response: {
        type: Sequelize.STRING('MAX'),
        allowNull: false,
      },
      Version: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      PromptVersion: {
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
    await queryInterface.dropTable('AiResponses');
  }
};
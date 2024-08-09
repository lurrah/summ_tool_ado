'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('AiResponses', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.sequelize.query(
      `UPDATE "AiResponses" SET "user_id" = ${process.env.github_id}`
    );
    await queryInterface.changeColumn('AiResponses', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('AiResponses', 'user_id');
  }
};

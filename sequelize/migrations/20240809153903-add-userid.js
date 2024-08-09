'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('IterationInfo', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.sequelize.query(
      `UPDATE "IterationInfo" SET "user_id" = ${process.env.github_id}`
    );
    await queryInterface.changeColumn('IterationInfo', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('IterationInfo', 'user_id');
  }
};

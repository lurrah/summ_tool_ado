'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Tokens', {
      fields: ['user_id'],
      type: 'unique',
      name: 'add_unique'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Tokens', 'add_unique')
  }
};

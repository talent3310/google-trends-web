'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
       queryInterface.addColumn(
        'monitor',
        'graphRanking',
        Sequelize.INTEGER(3),
        )];
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};



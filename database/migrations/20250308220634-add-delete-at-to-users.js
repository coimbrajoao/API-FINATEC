'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users','deleted_at',Sequelize.DATE,{allowNull:true});  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users','deleted_at');
  }
};

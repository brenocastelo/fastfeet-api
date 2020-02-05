module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'recipients',
      'person_id',
      Sequelize.STRING
    );
  },

  down: queryInterface => {
    return queryInterface.removeColumn('recipients', 'person_id');
  },
};

'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return Promise.all([queryInterface.removeColumn(
            'users',
            'test2',
            Sequelize.STRING
        ),
            queryInterface.addColumn(
                'users',
                'test3',
                Sequelize.STRING
            )

            ])
        // return Promise.resolve()
    },


    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.dropTable('users');
        */
        return Promise.resolve()
    }
};

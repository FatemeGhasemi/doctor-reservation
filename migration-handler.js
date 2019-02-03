module.exports = {
    up: function (queryInterface, Sequelize) {
        return [ queryInterface.addColumn(
            'users',
            'role',
            Sequelize.STRING
        )];
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
    }
};
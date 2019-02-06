const Sequelize = require('sequelize');
let sequelize;
let Status;
const initStatusSchema = () => {
    Status = sequelize.define('status', {
        name: {
            type: Sequelize.STRING,
            required: true
        }

    });
    //TODO Status.sync just needed once to create tables, so if tables created dont need call it any more
    // await Status.sync({force: true})
    return Status
};

module.exports = (injectedSequelize) => {
    if (!injectedSequelize) {
        if (!Status) throw new Error('Plz define schemas by calling db.initDb(');
        return Status
    }
    sequelize = injectedSequelize;
    return {
        initStatusSchema
    }
};
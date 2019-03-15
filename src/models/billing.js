const Sequelize = require('sequelize');
let sequelize;
let Billing;
const initBillingSchema = () => {
    Billing = sequelize.define('billing', {
        userId: {
            type: Sequelize.INTEGER,
            allowNull:true
        },
        refId:{
            type: Sequelize.STRING,
            unique: true
        } ,
        creditAmountInToman:{
            type:Sequelize.NUMERIC,
        },
        eachSmsCostInToman:{
            type:Sequelize.NUMERIC,
            defaultValue:200
        },
        status:{
            type:Sequelize.NUMERIC
        },
        expired:{
            type:Sequelize.BOOLEAN,
            defaultValue: false
        }


    });
    //TODO Billing.sync just needed once to create tables, so if tables created dont need call it any more
    // await Billing.sync({force: true})
    return Billing
};

module.exports = (injectedSequelize) => {
    if (!injectedSequelize) {
        if (!Billing) throw new Error('Plz define schemas by calling db.initDb(');
        return Billing
    }
    sequelize = injectedSequelize;
    return {
        initBillingSchema
    }
};
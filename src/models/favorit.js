const Sequelize = require('sequelize');
let sequelize;
let Favorite;
const initFavoriteSchema = () => {
    Favorite = sequelize.define('favorite', {
        userId: {
            type: Sequelize.STRING,
            required: true,
            unique:true
        },
        favoriteList: {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
        }

    });
    //TODO Favorite.sync just needed once to create tables, so if tables created dont need call it any more
    // await Favorite.sync({force: true})
    return Favorite
};

module.exports = (injectedSequelize) => {
    if (!injectedSequelize) {
        if (!Favorite) throw new Error('Plz define schemas by calling db.initDb(');
        return Favorite
    }
    sequelize = injectedSequelize;
    return {
        initFavoriteSchema
    }
};
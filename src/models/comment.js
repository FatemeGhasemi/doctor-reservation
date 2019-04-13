const Sequelize = require('sequelize');
let sequelize;
let Comment;
const initCommentSchema = () => {
    Comment = sequelize.define('comment', {
        doctorId: {
            type: Sequelize.INTEGER,
            allowNull:false
        },
        commentText: {
            type: Sequelize.STRING,
            allowNull: false
        },
        likes:{
            type:Sequelize.INTEGER,
            defaultValue: 0

        },
        dislikes:{
            type:Sequelize.INTEGER,
            defaultValue: 0
        },
        status:{
            type:Sequelize.STRING,
        },
        accessAbility:{
            type:Sequelize.STRING,
            allowNull:false,
            defaultValue:"isShown"
        }



    });
    //TODO Comment.sync just needed once to create tables, so if tables created dont need call it any more
    // await Comment.sync({force: true})
    return Comment
};

module.exports = (injectedSequelize) => {
    if (!injectedSequelize) {
        if (!Comment) throw new Error('Plz define schemas by calling db.initDb(');
        return Comment
    }
    sequelize = injectedSequelize;
    return {
        initCommentSchema
    }
};

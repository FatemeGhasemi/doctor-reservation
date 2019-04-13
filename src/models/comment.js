const Sequelize = require('sequelize');
let sequelize;
let Comment;
const initCommentSchema = () => {
    Comment = sequelize.define('comment', {
        doctorId: {
            type: Sequelize.INTEGER,
            unique: true
        },
        commentText: {
            type: Sequelize.ARRAY(Sequelize.STRING),
        },
        likes:{
            type:Sequelize.INTEGER,
        },
        dislikes:{
            type:Sequelize.INTEGER,
            unique:true
        },
        status:{
            type:Sequelize.STRING,
            unique:true
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

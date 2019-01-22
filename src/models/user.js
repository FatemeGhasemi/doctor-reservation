module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        userName: DataTypes.STRING,
        cellphone: DataTypes.STRING,
        gender: DataTypes.STRING,
        age: DataTypes.INTEGER,
        weight: DataTypes.INTEGER,
        height: DataTypes.INTEGER,
        city: DataTypes.STRING,
        avatar: DataTypes.STRING
    }, {});
    // User.associate = function(models) {
    //   // associations can be defined here
    // };
    return User;
};

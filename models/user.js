// Model of the User from the challenge db.
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        name: {
            type: DataTypes.String,
            allowNull: false
        },
        password: {
            type: DataTypes.String,
            allowNull: false
        },
        alias: {
            type: DataTypes.String,
            allowNull: true
        },
        email: {
            type: DataTypes.String,
            allowNull: false
        }
    });

    //TODO associate models
    // User.associate = function(models) {
    // User.hasMany(models.ChallengeInstance, {
    // });
    // }

    return User;
};

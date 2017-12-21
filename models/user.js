// Model of the User from the challenge db.
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        alias: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // validate: {
            //     isEmail: true
            // }
        }
    });

    User.associate = function(models) {
        User.belongsToMany(models.Template, { through: { model: models.Instance, unique: false }, foreignKey: 'issuer_id' });
    };

    return User;
};

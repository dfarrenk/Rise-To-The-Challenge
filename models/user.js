// Model of the User from the challenge db.
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        alias: { // Not used for now
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // validate: {
            //     isEmail: true
            // }
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    });

    User.associate = function(models) {
        User.hasMany(models.Template, { foreignKey: 'creator_id' })
        // User.belongsToMany(models.Template, { through: { model: models.Instance, unique: false }, foreignKey: 'issuer_id' });
    };

    return User;
};

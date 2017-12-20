// Model of the Challenge Template from the challenge db.
module.exports = function(sequelize, DataTypes) {
    var Template = sequelize.define("Template", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rule: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    //TODO associate models
    // Template.associate = function(models) {
    // Template.hasMany(models.ChallengeInstance, {
    // });
    // }

    return Template;
};

// Model of the Challenge Template from the challenge db.
// https://stackoverflow.com/questions/22958683/how-to-implement-many-to-many-association-in-sequelize
module.exports = function(sequelize, DataTypes) {
    var Template = sequelize.define("Template", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rule: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    });

    Template.associate = function(models) {
        Template.belongsTo(models.User, { foreignKey: 'creator_id' });
        Template.belongsToMany(models.User, { through: { model: models.Instance, unique: false }, foreignKey: 'template_id' });
    };

    return Template;
};

// {
//     timestamps:false
// }

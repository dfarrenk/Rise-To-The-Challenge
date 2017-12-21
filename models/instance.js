module.exports = function(sequelize, DataTypes) {
    var Instance = sequelize.define("Instance", {
        // Giving the Instance model a name of type STRING
        challenge_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        // issuer_id: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: 'Users', //Models are plural
        //         key: 'id'
        //     },
        //     allowNull: false
        // },
        accepter_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users', //Models are plural
                key: 'id'
            },
            allowNull: true
        },
        start_state: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        game_state: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        shelved_state: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    // Instance.associate = function(models) {
    //Unncesary due to being the child of a many to many relationship between User & Template?

    // Instance.belongsToMany(models.User, {
    //     foreignKey: {
    //         allowNull: false
    //     }
    // });
    // Instance.belongsTo(models.Template, {
    //     foreignKey: {
    //         allowNull: false
    //     }
    // });
    // };

    return Instance;
};

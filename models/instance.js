module.exports = function(sequelize, DataTypes) {
    var Instance = sequelize.define("Instance", {
        // Giving the Instance model a name of type STRING
        challengeID: {
            type: DataTypes.INTEGER,
            references: 'Template',
            referencesKey: 'id',
            allowNull: false
        },
        issuerName: {
            type: DataTypes.INTEGER,
            references: 'User',
            referencesKey: 'id',
            allowNull: false
        },
        accepterName: {
            type: DataTypes.INTEGER,
            references: 'User',
            referencesKey: 'id',
            allowNull: false
        },
        startState: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        gameState: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    Instance.associate = function(models) {
        // Associating Instance with Template & User
        // Each challenge has one instance, and has a many to many relationship with User

    };

    return Instance;
};


// challengeID FK
// issuerName FK
// accepterName FK

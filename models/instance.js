module.exports = function(sequelize, DataTypes) {
    var Instance = sequelize.define("Instance", {
        // Giving the Instance model a name of type STRING
        challenge_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        challenger_proof: {
            type: DataTypes.STRING,
            allowNull: true
        },
        challenged_proof: {
            type: DataTypes.STRING,
            allowNull: true
        },
        state: {
            type: DataTypes.ENUM(
                'challenge-issued', // When the instance is first created
                'challenge-accepted', // Recipient has accepted the challenge, has not yet submitted proof.
                'challenge-rejected', // Recipient has rejected the challenge
                'provided-proof', // Recipient has submitted proof for review
                'proof-accepted', // Issuer has approved the proof
                'proof-rejected', // Issuer has rejected the proof
                'archive-success',
                'archive-fail'
            ),
            defaultValue: 'challenge-issued'
        }
    });

    Instance.associate = function(models) {
        Instance.belongsTo(models.User, {
            foreignKey: 'issuer_id',
            allowNull: true,
            as: "issued"
        });

        Instance.belongsTo(models.User, {
            foreignKey: 'accepter_id',
            allowNull: true, //default value
            as: "accepted"
        });

        Instance.belongsTo(models.Template, {
            foreignKey: 'template_id'
        });
    };
    return Instance;
};

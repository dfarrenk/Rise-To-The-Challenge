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
         allowNull: false,
         validate: {
            is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/ 
         }
      },
      alias: {
         type: DataTypes.STRING,
         allowNull: true
      },
      email: {
         type: DataTypes.STRING,
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
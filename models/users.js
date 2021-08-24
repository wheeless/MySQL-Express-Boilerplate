"use strict";
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    "users",
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      FirstName: DataTypes.STRING,
      MiddleName: DataTypes.STRING,
      LastName: DataTypes.STRING,
      Username: { type: DataTypes.STRING, unique: true },
      Password: DataTypes.STRING,
      Email: { type: DataTypes.STRING, unique: true },
      Admin: { type: DataTypes.BOOLEAN, defaultValue: false },
      Deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
      lastLogin: { type: DataTypes.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
      joined: { type: DataTypes.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
    },
    {}
  );
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};

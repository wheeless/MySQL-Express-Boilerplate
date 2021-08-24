"use strict";
module.exports = (sequelize, DataTypes) => {
  const posts = sequelize.define(
    "posts",
    {
      PostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      PostTitle: DataTypes.STRING,
      PostBody: DataTypes.STRING,
      UserId: {
        type: DataTypes.INTEGER,
        model: "users",
        key: "UserId"
      },
      Username: {
        type: DataTypes.STRING,
        model: "users",
        key: "Username"
      },
      Deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
    },
    {}
  );
  posts.associate = function(models) {
    // associations can be defined here
  };
  return posts;
};

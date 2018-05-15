'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('hides', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    keyword: {
      type: DataTypes.STRING(156),
      allowNull: false
    },
    path: {
      type: DataTypes.STRING(72),
      allowNull: false
    },
    uidPath: {
      type: DataTypes.STRING(72),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(72),
      allowNull: false
    },
    sub_1: DataTypes.STRING(72),
    sub_2: DataTypes.STRING(72),
    sub_3: DataTypes.STRING(72),
    sub_4: DataTypes.STRING(72),
    
    
    // graphInfo: DataTypes.TEXT,
    searchType: DataTypes.ENUM('news', 'web', 'froogle'),
    periodMonth: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    movedAt:{
      type: DataTypes.DATE, defaultValue: DataTypes.NOW
    },
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    tableName: 'hides'
  });
}



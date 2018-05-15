module.exports = function(sequelize, DataTypes) {
  return sequelize.define('feeds', {
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
    count: {
      type: DataTypes.INTEGER(3),
      defaultValue: 0
    },
    graphInfo: DataTypes.TEXT,
    searchType: DataTypes.ENUM('news', 'web', 'froogle'),
    periodMonth: DataTypes.INTEGER,
    createdAt: DataTypes.DATEONLY,
    graphRanking: DataTypes.FLOAT
  }, {
    timestamps: true,
    updatedAt: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    tableName: 'feeds'
  });
};

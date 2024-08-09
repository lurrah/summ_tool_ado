'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IterationInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  IterationInfo.init({
    id: DataTypes.INTEGER,
    IteratId: DataTypes.STRING,
    ItemList: DataTypes.STRING,
    ListVersion: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'IterationInfo',
  });
  return IterationInfo;
};
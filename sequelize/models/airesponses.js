'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AiResponses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AiResponses.init({
    IteratId: DataTypes.STRING,
    Response: DataTypes.STRING,
    Version: DataTypes.INTEGER,
    PromptVersion: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AiResponses',
  });
  return AiResponses;
};
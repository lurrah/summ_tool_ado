const {sequelize} = require('../backend/db_connections.js');
const { DataTypes } = require('sequelize');

const iteratModel = sequelize.define(
    'IterationInfo',
    {
        IteratId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ItemList: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ListVersion: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        tableName: 'IterationInfo',
        freezeTableName: true,
    }
  )

const respModel = sequelize.define(
    'AiResponses',
    {
        IteratId: {
            type: DataTypes.STRING,
            allowNull: false,
            // references: {
            //     model: 'IterationInfo',
            //     key: 'IteratId'
            // }
        },
        Response: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Version: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        PromptVersion: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        tableName: 'AiResponses',
        freezeTableName: true,
    }
)

const userModel = sequelize.define(
    'Users',
    {
        github_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        ado_pat: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }
)

const tokenModel = sequelize.define(
    'Tokens',
    {
        access_token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }
)

module.exports = { respModel, iteratModel, userModel, tokenModel }

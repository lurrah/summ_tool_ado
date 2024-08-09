
const sql = require('mssql');
const { Sequelize } = require('sequelize');
  
  const sequelize = new Sequelize(process.env.DB_NAME, 'laurab', process.env.DB_PASS, {
    host: process.env.DB_SERVER,
    dialect: 'mssql',
    dialectOptions: {
      encrypt: true,
      trustServerCertificate: false,
    }
  });

  async function connectDB() {
    try { 
        await sequelize.authenticate();
        await sequelize.sync();

        return 'Database Connected';
    } catch (err) {
        throw err;
    }
  }

  async function closeDB() {
    try {
        await sequelize.close();
        return 'Database Closed';
    } catch (err) {
        console.error('Error closing database connection:', err);
    }
  }


  module.exports = { sequelize, connectDB, closeDB }


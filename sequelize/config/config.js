const env = require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "SummTool-db",
    host: process.env.DB_SERVER,
    dialect: "mssql",
    dialectOptions: {
      encrypt: true,
      trustServerCertificate: false
    }
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "SummTool-db",
    host: process.env.DB_SERVER,
    dialect: "mssql",
    dialectOptions: {
      encrypt: true,
      trustServerCertificate: false
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "summtool-db2",
    host: process.env.DB_SERVER,
    dialect: "mssql",
    dialectOptions: {
      encrypt: true,
      trustServerCertificate: false
    }
  }
}

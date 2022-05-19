//Import the Sequelize constructor from the library
const Sequelize = require('sequelize');

require('dotenv').config();

//create a connection to our db, pass in your MYSQL info for user and pass
const sequelize = new Sequelize(process.env.DB_name, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;
const { Sequelize } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
    host: config.database.host,
    dialect: 'mysql'
});
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
module.exports = sequelize;
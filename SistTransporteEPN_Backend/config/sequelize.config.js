const { Sequelize } = require('sequelize');

const username = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || 'root';
const bdd_name = process.env.DB_NAME || 'sistema_transporte';
const hostName = process.env.DB_HOST || 'localhost';

const sequelize = new Sequelize(bdd_name, username, password, {
    host: hostName,
    dialect: 'mysql',
});

sequelize.sync().then(() => {
    console.log('Base de datos sincronizada');
}).catch(err => {
    console.log('Error al sincronizar la BDD', err);
});

module.exports = sequelize;
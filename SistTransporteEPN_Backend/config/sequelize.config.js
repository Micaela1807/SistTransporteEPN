const { Sequelize } = require('sequelize');

const username = 'root';
const password = 'root';
const bdd_name = 'sistema_transporte';
const hostName = 'localhost';

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
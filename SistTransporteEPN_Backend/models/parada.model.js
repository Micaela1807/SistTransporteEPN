const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const Ruta = require('./ruta.model');

const Parada = sequelize.define('Parada', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    latitud: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    longitud: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    ruta: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
    }, {
    tableName: 'paradas',
    timestamps: false
});

Ruta.hasMany(Parada, {
    foreignKey: 'ruta',
    as: 'paradas',
    onDelete: 'CASCADE'
});

Parada.belongsTo(Ruta, {
    foreignKey: 'ruta',
    as: 'rutaData'
});

module.exports = Parada;


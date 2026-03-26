const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Administrador = sequelize.define('Administrador', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    tableName: 'administradores',
    timestamps: false
});

module.exports = Administrador;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Estudiante = sequelize.define('Estudiante', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
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
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    codigoUnico: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    ruta : {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    parada : {
        type: DataTypes.INTEGER,
        allowNull: true
    }

    }, {
    tableName: 'estudiantes',
    timestamps: false
});

module.exports = Estudiante;
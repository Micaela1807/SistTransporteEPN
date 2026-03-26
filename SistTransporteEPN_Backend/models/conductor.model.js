// models/conductor.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');
const Ruta = require('./ruta.model'); // Importamos el modelo Ruta

const Conductor = sequelize.define('Conductor', {
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
  cedula: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  ruta: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'conductores',
  timestamps: false
});

// Definir la asociación belongsTo (un conductor pertenece a una ruta).
// foreignKey: 'ruta'  => la columna en la tabla "conductores" que referencia a "rutas.id"
// as: 'rutaData'     => cómo llamarás a la relación en el include
Conductor.belongsTo(Ruta, {
  foreignKey: 'ruta',
  as: 'rutaData'
});

// (Opcional) La relación inversa:
// Ruta.hasMany(Conductor, {
//   foreignKey: 'ruta',
//   as: 'conductores'
// });

module.exports = Conductor;

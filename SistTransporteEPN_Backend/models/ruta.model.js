const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize.config');

const Ruta = sequelize.define('Ruta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  asientos_disponibles: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'rutas',
  timestamps: false
});

module.exports = Ruta;
const Conductor = require('../models/conductor.model.js');
const Ruta = require('../models/ruta.model.js');
const Parada = require('../models/parada.model.js');
const bcrypt = require('bcryptjs');

// 🔹 Estado global de rutas activas
let rutasActivas = {};

// 🟢 **Iniciar ruta (emitir evento WebSockets)**
module.exports.iniciarRuta = (io, req, res) => {
  const { rutaId, paradas } = req.body;
  
  console.log(`🚍 Conductor inició la ruta ${rutaId}.`);

  rutasActivas[rutaId] = { paradasRecorridas: [], paradas };
  io.emit(`ruta-${rutaId}`, rutasActivas[rutaId]); // Notificar a estudiantes

  res.json({ mensaje: "Ruta iniciada correctamente." });
};

// 🔄 **Actualizar parada (emitir evento WebSockets)**
module.exports.actualizarParada = (io, req, res) => {
  const { rutaId, parada } = req.body;

  if (!rutasActivas[rutaId]) {
    return res.status(400).json({ mensaje: "Ruta no iniciada" });
  }

  rutasActivas[rutaId].paradasRecorridas.push(parada);
  console.log(`📍 Parada agregada: ${parada} en la ruta ${rutaId}`);
  
  io.emit(`ruta-${rutaId}`, rutasActivas[rutaId]); // Notificar a estudiantes

  res.json({ mensaje: "Parada actualizada correctamente." });
};

// 🏁 **Finalizar ruta (emitir evento WebSockets)**
module.exports.terminarRuta = (io, req, res) => {
  const { rutaId } = req.body;

  if (!rutasActivas[rutaId]) {
    return res.status(400).json({ mensaje: "Ruta no iniciada" });
  }

  console.log(`🏁 Ruta ${rutaId} finalizada.`);
  delete rutasActivas[rutaId];

  io.emit(`ruta-${rutaId}-finalizada`, { mensaje: "🚏 La ruta ha finalizado." });

  res.json({ mensaje: "Ruta finalizada correctamente." });
};

// 🔹 Mantenemos el resto de las funciones sin cambios

module.exports.createConductor = async (req, res) => {
    const { nombre, apellido, correo, password, cedula, ruta } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const conductor = await Conductor.create({ 
            nombre, 
            apellido, 
            correo, 
            password: hashedPassword, 
            cedula, 
            ruta 
        });

        return res.status(201).json(conductor);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports.getConductores = async (req, res) => {
    try {
        const conductores = await Conductor.findAll();
        return res.status(200).json(conductores);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports.updateConductor = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correo, password, cedula, ruta } = req.body;
    try {
        const conductor = await Conductor.findByPk(id);
        if (!conductor) {
            return res.status(404).json({ message: 'Conductor no encontrado' });
        }

        conductor.nombre = nombre;
        conductor.apellido = apellido;
        conductor.correo = correo;
        conductor.cedula = cedula;
        conductor.ruta = ruta;

        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            conductor.password = await bcrypt.hash(password, salt);
        }

        await conductor.save();
        return res.status(200).json(conductor);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports.deleteConductor = async (req, res) => {
    const { id } = req.params;
    try {
        const conductor = await Conductor.findByPk(id);
        if (!conductor) {
            return res.status(404).json({ message: 'Conductor no encontrado' });
        }

        await conductor.destroy();
        return res.status(200).json({ message: 'Conductor eliminado con éxito' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports.getConductor = async (req, res) => {
    const { id } = req.params;
    try {
        const conductor = await Conductor.findByPk(id);
        if (!conductor) {
            return res.status(404).json({ message: 'Conductor no encontrado' });
        }
        return res.status(200).json(conductor);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports.getConductorConRuta = async (req, res) => {
    try {
      const conductorId = req.params.id;
      // Buscar por PK e incluir la asociación "rutaData" (definida en belongsTo)
      const conductor = await Conductor.findByPk(conductorId, {
        include: [
          {
            model: Ruta,
            as: 'rutaData'
          }
        ]
      });
  
      if (!conductor) {
        return res.status(404).json({ message: 'Conductor no encontrado' });
      }
  
      // Retornar al frontend
      return res.json(conductor);
    } catch (error) {
      console.error('Error al obtener conductor con ruta:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
}

// Obtener todas las paradas de una ruta de un conductor

// Obtener todas las paradas de una ruta asociada a un conductor
module.exports.getParadasConductor = async (req, res) => {
    try {
        const conductorId = req.params.id;

        // Buscar al conductor y la ruta asociada con sus paradas
        const conductor = await Conductor.findByPk(conductorId, {
            include: [
                {
                    model: Ruta,
                    as: 'rutaData', // Asegúrate de que este alias coincida con la asociación en tu modelo
                    include: [
                        {
                            model: Parada,
                            as: 'paradas', // Asegúrate de que este alias coincida con la asociación en tu modelo
                            attributes: ['id', 'nombre', 'longitud', 'latitud'] // Solo devuelve campos relevantes
                        }
                    ]
                }
            ]
        });

        if (!conductor) {
            return res.status(404).json({ message: 'Conductor no encontrado' });
        }

        // Verificar que el conductor tenga una ruta asignada
        if (!conductor.rutaData) {
            return res.status(404).json({ message: 'El conductor no tiene una ruta asignada.' });
        }

        // Retornar solo las paradas
        return res.json({
            ruta: conductor.rutaData.id, // ID de la ruta asociada
            paradas: conductor.rutaData.paradas // Lista de paradas
        });
    } catch (error) {
        console.error('Error al obtener paradas de conductor:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Verificación de contraseña para autenticación
module.exports.verificarPassword = async (req, res) => {
    const { correo, password } = req.body;
    try {
        const conductor = await Conductor.findOne({ where: { correo } });
        if (!conductor) {
            return res.status(404).json({ message: 'Correo no registrado' });
        }

        const isMatch = await bcrypt.compare(password, conductor.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        return res.status(200).json({ message: 'Autenticación exitosa' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
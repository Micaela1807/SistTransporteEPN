const Estudiante = require('../models/estudiante.model');
const Ruta = require('../models/ruta.model.js');
const Parada = require('../models/parada.model.js');
const bcrypt = require('bcryptjs');

module.exports.createEstudiante = async (req, res) => {
    const { nombre, apellido, correo, password, codigoUnico, ruta, parada } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const estudiante = await Estudiante.create({ 
            nombre, 
            apellido, 
            correo, 
            password: hashedPassword, 
            codigoUnico, 
            ruta, 
            parada 
        });

        return res.status(201).json(estudiante);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
module.exports.getAllEstudiantes = async (req, res) => {
    try {
        const estudiantes = await Estudiante.findAll();
        return res.status(200).json(estudiantes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports.updateEstudiante = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correo, password, codigoUnico, ruta, parada } = req.body;
    try {
        const estudiante = await Estudiante.findByPk(id);
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        estudiante.nombre = nombre;
        estudiante.apellido = apellido;
        estudiante.correo = correo;
        estudiante.codigoUnico = codigoUnico;
        estudiante.ruta = ruta;
        estudiante.parada = parada;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            estudiante.password = await bcrypt.hash(password, salt);
        }

        await estudiante.save();
        return res.status(200).json(estudiante);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


module.exports.getEstudiante = async (req, res) => {
    const { id } = req.params;
    try {
        const estudiante = await Estudiante.findByPk(id);
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }
        return res.status(200).json(estudiante);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//Obtener las paradas de una ruta de un estudiante

module.exports.getParadasEstudiante = async (req, res) => {
    const { id } = req.params;
    try {
        const estudiante = await Estudiante.findByPk(id);
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }
        const ruta = await Ruta.findByPk(estudiante.ruta);
        if (!ruta) {
            return res.status(404).json({ message: 'Ruta no encontrada' });
        }
        const paradas = await Parada.findAll({ where: { ruta: ruta.id } });
        return res.status(200).json(paradas);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//Actualizar la ruta de un estudiante

module.exports.updateRutaEstudiante = async (req, res) => {
    const { id } = req.params; // ID del estudiante
    const { ruta } = req.body; // Nueva ruta seleccionada

    try {
        // Buscar al estudiante
        const estudiante = await Estudiante.findByPk(id);
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        // Si el estudiante ya tiene una parada seleccionada, restaurar los asientos de la ruta actual
        if (estudiante.parada) {
            const paradaActual = await Parada.findByPk(estudiante.parada);
            if (paradaActual) {
                const rutaActual = await Ruta.findByPk(paradaActual.ruta);
                if (rutaActual) {
                    await rutaActual.update({ asientos_disponibles: rutaActual.asientos_disponibles + 1 });
                }
            }
        }

        // Actualizar la ruta y marcar la parada como NULL
        estudiante.ruta = ruta;
        estudiante.parada = null; // Limpiar la parada al cambiar de ruta
        await estudiante.save();

        return res.status(200).json({
            message: 'Ruta actualizada y parada desasignada correctamente',
            estudiante,
        });
    } catch (error) {
        console.error('Error al actualizar ruta y desasignar parada:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports.deleteEstudiante = async (req, res) => {
    const { id } = req.params;
    try {
        const estudiante = await Estudiante.findByPk(id);
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }
        await estudiante.destroy();

        return res.status(200).json({ message: 'Estudiante eliminado correctamente' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


//Actualizar la parada de un estudiante
module.exports.updateParadaEstudiante = async (req, res) => {
    const { id } = req.params; // ID del estudiante
    const { parada } = req.body; // Nueva parada o null para desasociar

    try {
        // Buscar al estudiante
        const estudiante = await Estudiante.findByPk(id);
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        // Si parada es null, eliminar la selección de parada
        if (parada === null) {
            const paradaAnteriorId = estudiante.parada;

            if (paradaAnteriorId) {
                const paradaAnterior = await Parada.findByPk(paradaAnteriorId);
                if (paradaAnterior) {
                    const rutaAnterior = await Ruta.findByPk(paradaAnterior.ruta);
                    if (rutaAnterior) {
                        // Incrementar los asientos disponibles en la ruta de la parada anterior
                        await rutaAnterior.update({ asientos_disponibles: rutaAnterior.asientos_disponibles + 1 });
                    }
                }
            }

            // Desasociar la parada del estudiante
            estudiante.parada = null;
            await estudiante.save();

            return res.status(200).json({ message: 'Parada eliminada correctamente', estudiante });
        }

        // Si parada no es null, validar y actualizar la nueva parada
        const nuevaParada = await Parada.findByPk(parada);
        if (!nuevaParada) {
            return res.status(404).json({ message: 'Parada no encontrada' });
        }

        const rutaNueva = await Ruta.findByPk(nuevaParada.ruta);
        if (!rutaNueva) {
            return res.status(404).json({ message: 'Ruta no encontrada' });
        }
        
        // Verificar si la nueva parada pertenece a la misma ruta
        if (estudiante.parada !== null) {
            // Si el estudiante ya tenía una parada seleccionada, no modificar el número de asientos disponibles
            estudiante.parada = parada;
            await estudiante.save();
            return res.status(200).json({
                message: 'Parada actualizada correctamente',
                estudiante,
            });
        } else {
            // Reducir los asientos disponibles en la nueva ruta solo si el estudiante no tenía una parada seleccionada
            if (!estudiante.parada) {
                if (rutaNueva.asientos_disponibles > 0) {
                    await rutaNueva.update({ asientos_disponibles: rutaNueva.asientos_disponibles - 1 });
                    console.log('Asientos disponibles en la nueva ruta:', rutaNueva.asientos_disponibles);
                } else {
                    return res.status(400).json({ message: 'No hay asientos disponibles en la ruta de la parada' });
                }
            }

            // Incrementar los asientos disponibles en la ruta anterior si el estudiante tenía una parada seleccionada
            const rutaAnterior = await Ruta.findByPk(estudiante.ruta);
            if (rutaAnterior && estudiante.parada) {
                await rutaAnterior.update({ asientos_disponibles: rutaAnterior.asientos_disponibles + 1 });
            }

            // Actualizar la parada y la ruta del estudiante
            estudiante.parada = parada;
            estudiante.ruta = nuevaParada.ruta;
            await estudiante.save();

            return res.status(200).json({
                message: 'Parada y ruta actualizadas correctamente',
                estudiante,
            });
        }
    } catch (error) {
        console.error('Error al actualizar parada y asientos:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};


module.exports.verificarParadasEstudiantes = async (req, res) => {
    try {
        // Valores por defecto para los asientos disponibles en las rutas
        const valoresPorDefecto = {
            1: 20, // Ruta 1
            2: 25, // Ruta 2
            3: 30, // Ruta 3
        };

        // Restablecer los valores de los asientos disponibles en cada ruta
        const rutas = await Ruta.findAll();
        for (const ruta of rutas) {
            if (valoresPorDefecto[ruta.id] !== undefined) {
                ruta.asientos_disponibles = valoresPorDefecto[ruta.id];
                await ruta.save();
            }
        }
        console.log('Asientos restablecidos a sus valores por defecto:', valoresPorDefecto);

        // Obtener todos los estudiantes que tienen una parada seleccionada
        const estudiantesConParada = await Estudiante.findAll({
            where: { parada: { [require('sequelize').Op.not]: null } },
        });

        // Crear un objeto para almacenar la cantidad de estudiantes por ruta
        const rutaAsientos = {};

        for (const estudiante of estudiantesConParada) {
            // Verificar si ya se ha procesado esta ruta
            if (!rutaAsientos[estudiante.ruta]) {
                // Contar cuántos estudiantes tienen una parada en esta ruta
                const estudiantesEnRuta = await Estudiante.count({
                    where: { ruta: estudiante.ruta, parada: { [require('sequelize').Op.not]: null } },
                });

                // Actualizar los asientos disponibles de la ruta
                const ruta = await Ruta.findByPk(estudiante.ruta);
                if (ruta) {
                    ruta.asientos_disponibles = Math.max(0, ruta.asientos_disponibles - estudiantesEnRuta);
                    await ruta.save();
                    rutaAsientos[estudiante.ruta] = ruta.asientos_disponibles;
                }
            }
        }
    } catch (error) {
        console.error('Error al verificar paradas y ajustar asientos:', error);
    }
};

// Verificación de contraseña para autenticación
module.exports.verificarPassword = async (req, res) => {
    const { correo, password } = req.body;
    try {
        const estudiante = await Estudiante.findOne({ where: { correo } });
        if (!estudiante) {
            return res.status(404).json({ message: 'Correo no registrado' });
        }

        const isMatch = await bcrypt.compare(password, estudiante.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        return res.status(200).json({ message: 'Autenticación exitosa' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
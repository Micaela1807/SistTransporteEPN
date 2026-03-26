const Ruta = require('../models/ruta.model');
const Parada = require('../models/parada.model');

module.exports.getRutasConParadas = async (req, res) => {
    try {
        const rutas = await Ruta.findAll({
            attributes: ['id', 'nombre', 'asientos_disponibles'], // Solo obtenemos estos atributos de Rutas
            include: [{
                model: Parada,
                as: 'paradas',
                attributes: ['nombre'] // Solo obtenemos el nombre de las Paradas
            }]
        });

        return res.status(200).json(rutas);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Obtener una ruta específica
module.exports.getRuta = async (req, res) => {
    const { id } = req.params;
    try {
        const ruta = await Ruta.findByPk(id, {
            attributes: ['id', 'nombre', 'asientos_disponibles'],
            include: [{
                model: Parada,
                as: 'paradas',
                attributes: ['nombre']
            }]
        });

        if (!ruta) {
            return res.status(404).json({ message: 'Ruta no encontrada' });
        }
        return res.status(200).json(ruta);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Agregar una nueva ruta con paradas
module.exports.createRuta = async (req, res) => {
    const { nombre, paradas } = req.body; // 'paradas' debe ser un array de nombres

    try {
        const nuevaRuta = await Ruta.create({ nombre});

        if (paradas && paradas.length > 0) {
            const paradasData = paradas.map(nombre => ({
                nombre,
                ruta: nuevaRuta.id
            }));
            await Parada.bulkCreate(paradasData);
        }

        return res.status(201).json({ message: 'Ruta creada con éxito', ruta: nuevaRuta });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Editar una ruta y sus paradas
module.exports.updateRuta = async (req, res) => {
    const { id } = req.params;
    const { nombre, paradas } = req.body; // 'paradas' es un array de nombres

    try {
        const ruta = await Ruta.findByPk(id);
        if (!ruta) {
            return res.status(404).json({ message: 'Ruta no encontrada' });
        }

        // Actualizar la ruta
        await Ruta.update({ nombre }, { where: { id } });

        // Actualizar las paradas
        if (paradas) {
            await Parada.destroy({ where: { ruta: id } }); // Borrar paradas antiguas
            const nuevasParadas = paradas.map(nombre => ({ nombre, ruta: id }));
            await Parada.bulkCreate(nuevasParadas);
        }

        return res.status(200).json({ message: 'Ruta actualizada con éxito' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Eliminar una ruta y sus paradas (en cascada)
module.exports.deleteRuta = async (req, res) => {
    const { id } = req.params;

    try {
        const ruta = await Ruta.findByPk(id);
        if (!ruta) {
            return res.status(404).json({ message: 'Ruta no encontrada' });
        }

        await Ruta.destroy({ where: { id } }); // En cascada elimina paradas asociadas
        return res.status(200).json({ message: 'Ruta eliminada con éxito' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
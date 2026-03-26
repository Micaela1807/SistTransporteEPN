require("dotenv").config();
const jwt = require('jsonwebtoken');
const { Administrador, Conductor, Estudiante } = require('../models');

module.exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Extraer el token

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "password_secreto");

            let user;
            if (decoded.role === 'admin') {
                user = await Administrador.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
            } else if (decoded.role === 'conductor') {
                user = await Conductor.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
            } else if (decoded.role === 'estudiante') {
                user = await Estudiante.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
            }

            if (!user) {
                return res.status(401).json({ message: 'Usuario no autorizado' });
            }

            req.user = user;
            req.user.role = decoded.role; // Almacenar el rol del usuario en req.user
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No autorizado, token no encontrado' });
    }
};

// Verificar si el usuario es administrador recuperado del token
module.exports.admin = async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(401).json({ message: 'No autorizado, solo administradores' });
    }
};
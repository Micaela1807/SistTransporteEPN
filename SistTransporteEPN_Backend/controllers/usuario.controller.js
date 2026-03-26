const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Administrador, Conductor, Estudiante } = require('../models');

const generarToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || "password_secreto", {
        expiresIn: '1d'
    });
};

module.exports.login = async (req, res) => {
    const { correo, password: bodyPassword } = req.body;

    try {
        let user = null;
        let role = null;

        // Buscar en Administradores
        user = await Administrador.findOne({ where: { correo } });
        if (user) role = 'admin';

        // Si no está en Administradores, buscar en Conductores
        if (!user) {
            user = await Conductor.findOne({ where: { correo } });
            if (user) role = 'conductor';
        }

        // Si no está en Administradores ni Conductores, buscar en Estudiantes
        if (!user) {
            user = await Estudiante.findOne({ where: { correo } });
            if (user) role = 'estudiante';
        }

        // Si no se encuentra en ninguna tabla
        if (!user) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }

        let isMatch = false;

        // Intentar verificar la contraseña con bcrypt si está encriptada
        if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
            isMatch = await bcrypt.compare(bodyPassword, user.password); // Hashed password
        } else {
            isMatch = (bodyPassword === user.password); // Plain-text password
        }

        if (!isMatch) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }

        const { password, ...userWithoutPassword } = user.toJSON();
        
        return res.status(200).json({
            ...userWithoutPassword,
            role,  // Agregar el rol en la respuesta
            token: generarToken(user.id, role), // Pasar el rol al generar el token
        });

    } catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
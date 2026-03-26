const UsuarioController = require('../controllers/usuario.controller');

module.exports = function(app) {
    app.post('/login', UsuarioController.login);
}
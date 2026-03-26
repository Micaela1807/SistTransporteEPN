const RutaOptimaController = require('../controllers/rutaOptima.controller');

module.exports = function(app) {
    app.post('/rutas/optima', RutaOptimaController.getRutaOptima);
};

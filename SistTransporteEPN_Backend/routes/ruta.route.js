const RutaController = require('../controllers/ruta.controller');
const { protect } = require('../middleware/protect');

module.exports = function(app) {
    app.get('/rutas', protect,RutaController.getRutasConParadas);
    app.get('/rutas/:id',RutaController.getRuta);
    app.post('/rutas', protect,RutaController.createRuta);
    app.put('/rutas/:id', protect,RutaController.updateRuta);
    app.delete('/rutas/:id', protect,RutaController.deleteRuta);
}

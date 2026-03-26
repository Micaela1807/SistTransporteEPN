const EstudianteController = require('../controllers/estudiante.controller');
const { protect, admin } = require('../middleware/protect');

module.exports = function(app) {
    app.post('/estudiantes', EstudianteController.createEstudiante);
    app.get('/estudiantes', protect, admin,EstudianteController.getAllEstudiantes);
    app.get('/estudiantes/:id/paradas', protect,EstudianteController.getParadasEstudiante);
    app.put('/estudiantes/:id/paradas', protect,EstudianteController.updateParadaEstudiante);
    app.get('/estudiantes/:id', protect,EstudianteController.getEstudiante);
    app.put('/estudiantes/:id', protect, admin,EstudianteController.updateEstudiante);
    app.put('/estudiantes/:id/ruta', protect,EstudianteController.updateRutaEstudiante);
    app.delete('/estudiantes/:id', protect, admin,EstudianteController.deleteEstudiante);
}
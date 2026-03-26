const express = require("express");
const router = express.Router();
const ConductorController = require("../controllers/conductor.controller");
const { protect, admin } = require("../middleware/protect");

// 🔹 **Función que recibe `io` y devuelve el router**
module.exports = (io) => {
  const router = express.Router();

  router.post("/iniciar-ruta", protect, (req, res) => ConductorController.iniciarRuta(io, req, res));
  router.post("/actualizar-parada", protect, (req, res) => ConductorController.actualizarParada(io, req, res));
  router.post("/terminar-ruta", protect, (req, res) => ConductorController.terminarRuta(io, req, res));

  // Rutas HTTP REST normales
  router.post("/", protect, admin, ConductorController.createConductor);
  router.get("/", protect, admin, ConductorController.getConductores);
  router.get("/:id", protect, ConductorController.getConductorConRuta);
  router.put("/:id", protect, admin, ConductorController.updateConductor);
  router.get("/:id/paradas", protect, ConductorController.getParadasConductor);
  router.delete("/:id", protect, admin, ConductorController.deleteConductor);

  return router;
};

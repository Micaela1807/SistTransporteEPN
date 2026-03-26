const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app); // Servidor HTTP para WebSockets
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Cambia esto si el frontend tiene otro puerto
    methods: ["GET", "POST"]
  }
});

const port = 8000;

require("./config/sequelize.config");

const EstudianteController = require("./controllers/estudiante.controller");

// 🔹 **Verificar paradas al iniciar el servidor**
(async () => {
  try {
    console.log("Verificando paradas y ajustando asientos al iniciar el servidor...");
    await EstudianteController.verificarParadasEstudiantes();
    console.log("Ajustes completados.");
  } catch (error) {
    console.error("Error al verificar paradas al iniciar:", error);
  }
})();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 **Autenticación en WebSockets**
io.use((socket, next) => {
  const token = socket.handshake.query.token;

  if (!token) {
    return next(new Error("Autenticación requerida"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "password_secreto");
    socket.user = decoded; // Guardamos los datos del usuario en el socket
    next();
  } catch (error) {
    return next(new Error("Token inválido"));
  }
});

// 🔹 **Configurar WebSockets**
let rutasActivas = {}; // Estado global de rutas

io.on("connection", (socket) => {
  console.log(`🟢 Cliente conectado: ${socket.id}`);

  socket.on("iniciarRuta", ({ rutaId, paradas }) => {
    console.log(`🚍 Ruta ${rutaId} iniciada.`);
    rutasActivas[rutaId] = { paradasRecorridas: [], paradas };
    io.emit(`ruta-${rutaId}`, rutasActivas[rutaId]); // Notificar a estudiantes
  });

  socket.on("actualizarParada", ({ rutaId, parada }) => {
    if (rutasActivas[rutaId]) {
      rutasActivas[rutaId].paradasRecorridas.push(parada);
      console.log(`🔄 Ruta ${rutaId} actualizada. Parada: ${parada}`);
      io.emit(`ruta-${rutaId}`, rutasActivas[rutaId]); // Enviar actualización a estudiantes
    }
  });

  socket.on("terminarRuta", ({ rutaId }) => {
    console.log(`🏁 Ruta ${rutaId} finalizada.`);
    delete rutasActivas[rutaId];
    io.emit(`ruta-${rutaId}-finalizada`, { mensaje: "🚏 La ruta ha finalizado." });
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Cliente desconectado: ${socket.id}`);
  });
});

// 🔹 **Importar rutas correctamente**
const conductorRoutes = require("./routes/conductor.route")(io);
app.use("/conductores", conductorRoutes);

const allUsuariosRoutes = require('./routes/usuario.route');
allUsuariosRoutes(app);

const allEstudiantesRoutes = require('./routes/estudiante.route');
allEstudiantesRoutes(app);

const allRutasRoutes = require('./routes/ruta.route');
allRutasRoutes(app);

const allRutaOptimaRoutes = require('./routes/rutaOptima.route');
allRutaOptimaRoutes(app);


// 🔹 **Iniciar servidor con WebSockets**
server.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});

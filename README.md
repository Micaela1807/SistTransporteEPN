# Sistema de Transporte Polibus 
Sistema integral de gestión y monitoreo de transporte escolar con aplicaciones web y móvil. Conecta administradores, conductores y estudiantes en una plataforma unificada para optimizar las rutas y mejorar la experiencia de transporte.

---

## 📱 Arquitectura del Proyecto

El proyecto está dividido en tres módulos principales:

### 1. **Backend** 
API REST construida con Node.js y Express que maneja toda la lógica de negocio.

**Stack Tecnológico:**
- Node.js + Express
- MySQL + Sequelize ORM
- JWT para autenticación
- Socket.io para comunicación en tiempo real
- bcryptjs para encriptación de contraseñas

### 2. **Frontend Web** 
Aplicación web reactiva para administradores y conductores.

**Stack Tecnológico:**
- React 18
- React Router DOM para navegación
- Axios para peticiones HTTP
- Leaflet + React-Leaflet para mapas interactivos
- CSS personalizado

### 3. **Aplicación Móvil** 
Aplicación móvil nativa para estudiantes y conductores.

**Stack Tecnológico:**
- React Native con Expo
- React Navigation para navegación
- Socket.io-client para comunicación en tiempo real
- React Native Maps para mapeo
- AsyncStorage para persistencia local

---

## ✨ Funcionalidades Principales

### 👨‍💼 Administrador
- ✅ Gestión completa de conductores (crear, editar, eliminar, ver)
- ✅ Gestión de estudiantes (crear, editar, eliminar, ver)
- ✅ Administración de rutas y paradas
- ✅ Visualización de reportes y estadísticas
- ✅ Monitoreo en tiempo real del estado de las rutas
- ✅ Asignación de rutas a conductores
- ✅ Dashboard de control centralizado

### 🚗 Conductor
- ✅ Inicio/finalización de rutas
- ✅ Seguimiento de paradas en tiempo real
- ✅ Visualización de estudiantes en la ruta actual
- ✅ Mapa interactivo con ubicación GPS
- ✅ Notificaciones en tiempo real de cambios
- ✅ Validación de estudiantes en cada parada
- ✅ Historial de rutas completadas

### 👨‍🎓 Estudiante
- ✅ Registro y autenticación segura
- ✅ Selección de ruta disponible
- ✅ Selección de parada de origen
- ✅ Visualización del estado de la ruta en tiempo real
- ✅ Mapa interactivo para ver ubicación del bus
- ✅ Notificaciones de llegada a parada
- ✅ Historial de viajes
- ✅ Interfaz intuitiva en aplicación móvil

---

## 🗄️ Estructura de Base de Datos

### Entidades Principales:
- **Administradores**: Gestión y control de la plataforma
- **Conductores**: Operadores de transporte con asignación de rutas
- **Estudiantes**: Usuarios finales del servicio de transporte
- **Rutas**: Caminos y trayectos recorridos por los buses
- **Paradas**: Puntos estratégicos de recogida y descenso

### Relaciones:
- Conductores → Rutas (1:N)
- Estudiantes → Rutas (N:1)
- Estudiantes → Paradas (N:1)
- Rutas → Paradas (N:N)

---
## 📡 API Endpoints Principales

### Autenticación
- `POST /api/usuarios/login` - Iniciar sesión
- `POST /api/usuarios/register` - Registrar nuevo usuario

### Estudiantes
- `GET /api/estudiantes` - Obtener lista de todos los estudiantes
- `POST /api/estudiantes` - Crear nuevo estudiante
- `PUT /api/estudiantes/:id` - Actualizar información del estudiante
- `DELETE /api/estudiantes/:id` - Eliminar estudiante
- `GET /api/estudiantes/:id` - Obtener detalles de un estudiante

### Conductores
- `GET /api/conductores` - Obtener lista de conductores
- `POST /api/conductores` - Crear nuevo conductor
- `POST /api/conductores/iniciar-ruta` - Iniciar ruta (WebSocket)
- `POST /api/conductores/actualizar-parada` - Actualizar parada actual
- `POST /api/conductores/terminar-ruta` - Finalizar ruta
- `PUT /api/conductores/:id` - Actualizar información del conductor

### Rutas
- `GET /api/rutas` - Obtener todas las rutas disponibles
- `GET /api/rutas/:id` - Obtener detalles de una ruta específica
- `POST /api/rutas` - Crear nueva ruta
- `PUT /api/rutas/:id` - Actualizar información de ruta
- `DELETE /api/rutas/:id` - Eliminar ruta
- `GET /api/rutas/:id/paradas` - Obtener paradas de una ruta

### Ruta Óptima
- `POST /api/rutas-optimas/calcular` - Calcular ruta optimizada

---

## 🔐 Autenticación y Seguridad

- ✅ Contraseñas encriptadas con bcryptjs (10 salts)
- ✅ Tokens JWT para autenticación sin estado
- ✅ Middleware de protección en rutas sensibles
- ✅ CORS configurado para solicitudes seguras
- ✅ Validación de datos en servidor
- ✅ Control de acceso basado en roles (RBAC)

---

## 📊 Características Avanzadas

### Comunicación en Tiempo Real (WebSockets)
- ✅ Actualizaciones instantáneas de posición del bus
- ✅ Notificaciones de cambio de parada
- ✅ Sincronización automática entre múltiples clientes
- ✅ Eventos personalizados por ruta

### Mapas Interactivos
- ✅ Visualización de rutas y paradas
- ✅ Ubicación GPS en tiempo real
- ✅ Cálculo automático de distancias
- ✅ Interfaz tipo Google Maps
- ✅ Zoom e interactividad completa

### Optimización de Rutas
- ✅ Algoritmos de cálculo de ruta más eficiente
- ✅ Minimización de tiempo de recorrido
- ✅ Controlador dedicado para optimización

**¡Gracias por usar Polibus! 🚌**

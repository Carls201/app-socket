const http = require('http');
const { Server } = require('socket.io');

// Crear servidor HTTP
const server = http.createServer();
const PORT = process.env.PORT || 3000; 
const io = new Server(server, {
  cors: {
    origin: "*" // Permite conexiones desde cualquier origen (ajusta para producción)
  }
});

// Variable para almacenar el último mensaje
let ultimoMensaje = null;

// Manejar conexiones de Socket.io
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  // Escuchar eventos personalizados
  socket.on('mensaje', (data) => {
    console.log('Mensaje recibido:', data);
    // Almacenar el último mensaje
    ultimoMensaje = data;
    // Enviar respuesta a todos los clientes
    io.emit('respuesta', `Servidor recibió: ${data}`);
  });

  // Manejar desconexión
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Endpoint HTTP GET para obtener el último mensaje
server.on('request', (req, res) => {
  if (req.method === 'GET' && req.url === '/ultimo-mensaje') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify({ ultimoMensaje: ultimoMensaje }));
  }
});

// Iniciar servidor
server.listen(PORT, '0.0.0.0', () => {
  console.log('Servidor Socket.io escuchando en puerto 3000');
});
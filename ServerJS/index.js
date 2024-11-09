const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000; // Puedes cambiar el puerto si es necesario

// Configurar CORS para permitir solicitudes de diferentes orígenes
app.use(cors());

app.use(express.json()); 

// Conectar a la base de datos en XAMPP (MariaDB)
const db = mysql.createConnection({
  host: 'localhost', // El servidor de tu base de datos
  user: 'root',      // Usuario de MySQL (por defecto en XAMPP es 'root')
  password: '',      // Contraseña de MySQL (por defecto en XAMPP está vacía)
  database: 'theoffices', // Nombre de tu base de datos
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MariaDB');
});

// Ruta para obtener todos los productos
app.get('/api/productos', (req, res) => {
  const sql = 'SELECT producto.ID_Producto, producto.Nombre, producto.Descripcion, producto.Precio, inventario.Cantidad FROM producto, inventario WHERE producto.Inventario = inventario.ID_Inventario AND inventario.Cantidad > 0;';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send('Error en la consulta a la base de datos');
    }
    res.json(results);
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;  // Capturar los datos enviados por el cliente

  if (!username || !password) {
    return res.status(400).json({ error: 'Por favor, ingrese usuario y contraseña' });
  }

  // Consulta para verificar el usuario usando placeholders para evitar inyección SQL
  const sql = 'SELECT ID_Usuario, Usuario, Tipo, Correo, Pregunta, Direccion FROM usuario WHERE Usuario = ? AND Contrasena = ?;';
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      return res.status(500).send('Error en la consulta a la base de datos');
    }

    if (results.length === 1) {
      // Login exitoso, responde con el primer objeto del arreglo
      res.json(results[0]); // Envía solo el primer objeto
    } else {
      // Credenciales incorrectas
      res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
  });
});

// Ruta para registrar un nuevo usuario
app.post('/api/register', (req, res) => {
  const { username, password, correo, pregunta, respuesta, direccion } = req.body;

  if (!username || !password || !correo || !pregunta || !respuesta || !direccion) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const sql = 'INSERT INTO usuario (Usuario, Contrasena, Tipo, Correo, Pregunta, Respuesta, Direccion) VALUES (?, ?, 0, ?, ?, ?, ?);';
  db.query(sql, [username, password, correo, pregunta, respuesta, direccion], (err, results) => {
    if (err) {
      console.error('Error al insertar usuario:', err);
      return res.status(500).json({ error: 'Error al insertar el usuario en la base de datos' });
    }

    // Devuelve la respuesta como un JSON
    res.status(201).json({ message: 'Usuario anadido correctamente' });
  });
});

app.post('/api/addPedido', (req, res) => {
  const { total, user } = req.body;

  // Lógica para insertar el pedido en la base de datos
  const query = 'INSERT INTO pedido (Total, Fecha, ID_Usuario, Codigo, Clave) VALUES (?, DATE(NOW()), ?, NULL, NULL);';
  db.query(query, [total, user], (err, result) => {
    if (err) {
      console.error('Error al insertar el pedido:', err);
      return res.status(500).send('Error al crear el pedido.');
    }
    res.status(201).send({ message: 'Pedido creado con éxito', pedidoId: result.insertId });
  });
});

// Ruta para agregar detalles del pedido
app.post('/api/addDetalles', (req, res) => {
  const {usuario, total, producto, cantidad, subtotal } = req.body;

  // Lógica para insertar los detalles del pedido en la base de datos
  const query = 'INSERT INTO detallespedido (Pedido, Producto, Cantidad, Subtotal) VALUES ((SELECT ID_Pedido FROM pedido WHERE ID_Usuario = ? AND Fecha = DATE(NOW()) AND Total = ?), ?, ?, ?);';
  db.query(query, [usuario, total, producto, cantidad, subtotal], (err, result) => {
    if (err) {
      console.error('Error al insertar el detalle del pedido:', err);
      return res.status(500).send('Error al crear el detalle del pedido.');
    }
    res.status(201).send({ message: 'Detalle de pedido creado con éxito', detalleId: result.insertId });
  });
});





// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});


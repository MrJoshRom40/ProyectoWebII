const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000; // Puedes cambiar el puerto si es necesario

const nodemailer = require('nodemailer');

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'a21100320@ceti.mx', // Tu dirección de correo de Gmail
    pass: 'jylt tlad mahq lrut', // Contraseña o contraseña de aplicación
  },
});

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

app.post('/api/insert-usr', (req, res) => {
  const { username } = req.body;

  // Verifica si el campo username fue enviado
  if (!username) {
    return res.status(400).json({ error: 'Por favor, ingrese usuario' });
  }

  const sql = 'SELECT Pregunta FROM usuario WHERE Usuario = ?;';
  
  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de datos:', err);
      return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
    }

    if (results.length === 1) {
      // Envía la pregunta asociada al usuario
      return res.status(200).json({ pregunta: results[0].Pregunta });
    } else {
      // Si no encuentra el usuario, envía un error
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
  });
});

app.post('/api/check-answer', (req, res) => {
  const { respuesta, username } = req.body;

  // Verifica si los campos respuesta y username fueron enviados
  if (!respuesta || !username) {
    return res.status(400).json({ error: 'Faltan parámetros (respuesta o username)' });
  }

  const sql = 'SELECT Correo, Usuario, Contrasena FROM usuario WHERE Usuario = ? AND Respuesta = ?;';
  
  db.query(sql, [username, respuesta], (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de datos:', err);
      return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
    }

    if (results.length === 1) {
      // Respuesta correcta, obtenemos los datos del usuario
      const usuario = results[0].Usuario;
      const correo = results[0].Correo;
      const contrasena = results[0].Contrasena;

      // Llamar a la ruta para enviar el correo
      const mailSubject = 'Recuperación de Contraseña';
      const mailText = `Hola, aquí están los datos de tu cuenta:\n\nUsuario: ${usuario}\nContraseña: ${contrasena}`;

      // Llamada a la ruta de correo
      sendEmail(correo, mailSubject, mailText).then(() => {
        res.status(200).json({ message: 'Respuesta correcta, correo enviado con los datos.' });
      }).catch((err) => {
        res.status(500).json({ error: 'Error al enviar el correo.' });
      });
    } else {
      return res.status(400).json({ error: 'Respuesta incorrecta' });
    }
  });
});

// Función para enviar el correo
function sendEmail(to, subject, text) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: 'a21100320@ceti.mx',  // Correo del remitente
      to, // Correo del destinatario
      subject, // Asunto del correo
      text, // Contenido del correo
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error al enviar el correo:', err);
        reject(err);
      } else {
        console.log('Correo enviado:', info);
        resolve(info);
      }
    });
  });
}

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});


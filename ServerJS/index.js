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

app.post('/api/productos', (req, res) => {
  const { Nombre, Descripcion, Precio, Cantidad } = req.body;

  if (!Nombre || !Descripcion || Precio == null || Cantidad == null) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Primero, insertar en la tabla inventario
  const sqlInventario = 'INSERT INTO inventario (Cantidad) VALUES (?)';

  db.query(sqlInventario, [Cantidad], (err, resultInventario) => {
    if (err) {
      console.error('Error al agregar al inventario:', err);
      return res.status(500).json({ error: 'Error al agregar al inventario' });
    }

    const inventarioId = resultInventario.insertId; // ID del inventario generado

    // Luego, insertar en la tabla producto usando el ID del inventario generado
    const sqlProducto = `
      INSERT INTO producto (Nombre, Descripcion, Precio, Inventario)
      VALUES (?, ?, ?, ?);
    `;

    db.query(sqlProducto, [Nombre, Descripcion, Precio, inventarioId], (err, resultProducto) => {
      if (err) {
        console.error('Error al agregar el producto:', err);
        return res.status(500).json({ error: 'Error al agregar el producto' });
      }

      res.json({ message: 'Producto agregado correctamente', productoId: resultProducto.insertId });
    });
  });
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

app.get('/api/productos/:id', (req, res) => {
  const { id } = req.params; // Obtener el ID de los parámetros de la URL
  
  const sql = `
    SELECT producto.ID_Producto, producto.Nombre, producto.Descripcion, producto.Precio, inventario.Cantidad
    FROM producto
    JOIN inventario ON producto.Inventario = inventario.ID_Inventario
    WHERE producto.ID_Producto = ?;
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL:', err);
      return res.status(500).json({ error: 'Error al obtener el producto' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(results[0]); // Enviar el producto encontrado
  });
});

app.put('/api/productos/:id', (req, res) => {
  const { id } = req.params; // ID del producto recibido como parámetro
  const { Nombre, Descripcion, Precio, Cantidad } = req.body; // Datos enviados desde el cliente

  console.log('Datos recibidos en el backend:', { id, Nombre, Descripcion, Precio, Cantidad });

  // Verificar si el producto existe antes de actualizar
  const verificarProductoSql = `
    SELECT producto.ID_Producto, producto.Nombre, producto.Descripcion, producto.Precio, inventario.Cantidad
    FROM producto
    JOIN inventario ON producto.Inventario = inventario.ID_Inventario
    WHERE producto.ID_Producto = ?;
  `;

  db.query(verificarProductoSql, [id], (err, productoExistente) => {
    if (err) {
      console.error('Error al verificar el producto:', err);
      return res.status(500).json({ error: 'Error al verificar el producto' });
    }

    if (productoExistente.length === 0) {
      console.log('Producto no encontrado:', id);
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    console.log('Producto antes de la actualización:', productoExistente[0]);

    // Consulta SQL para actualizar el producto
    const sqlProducto = `
      UPDATE producto
      SET Nombre = ?, Descripcion = ?, Precio = ?
      WHERE ID_Producto = ?;
    `;

    db.query(sqlProducto, [Nombre, Descripcion, Precio, id], (err, resultProducto) => {
      if (err) {
        console.error('Error al actualizar producto:', err);
        return res.status(500).json({ error: 'Error al actualizar producto' });
      }

      if (resultProducto.affectedRows === 0) {
        console.log('No se afectaron filas al actualizar el producto:', id);
        return res.status(500).json({ error: 'No se pudo actualizar el producto' });
      }

      console.log('Producto actualizado correctamente:', resultProducto);

      // Actualizar inventario
      const sqlInventario = `
        UPDATE inventario
        SET Cantidad = ?
        WHERE ID_Inventario = (
          SELECT Inventario FROM producto WHERE ID_Producto = ?
        );
      `;

      db.query(sqlInventario, [Cantidad, id], (err, resultInventario) => {
        if (err) {
          console.error('Error al actualizar inventario:', err);
          return res.status(500).json({ error: 'Error al actualizar inventario' });
        }

        if (resultInventario.affectedRows === 0) {
          console.log('No se afectaron filas al actualizar el inventario:', id);
          return res.status(500).json({ error: 'No se pudo actualizar el inventario' });
        }

        // Verificar los cambios después de la actualización
        db.query(verificarProductoSql, [id], (err, productoActualizado) => {
          if (err) {
            console.error('Error al verificar el producto actualizado:', err);
            return res.status(500).json({ error: 'Error al verificar el producto actualizado' });
          }
          res.json({
            message: 'Producto e inventario actualizados correctamente',
            productoActualizado: productoActualizado[0],
          });
        });
      });
    });
  });
});

app.delete('/api/productos/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM producto WHERE ID_Producto = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el producto:', err);
      return res.status(500).json({ error: 'Error al eliminar el producto' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
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


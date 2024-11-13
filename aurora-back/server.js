const express = require('express');
const cors = require('cors');
const db = require('./controller/db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Rutas de pedidos
app.get('/api/orders', (req, res) => {
    db.query('SELECT * FROM Orders', (err, results) => {
        if (err) {
            return res.status(500).send('Error en la consulta a la base de datos');
        }
        res.json(results);
    });
});

app.post('/api/orders', (req, res) => {
    const {
        customerName, contact, deliveryAddress, tableNumber, orderMode, subtotal, discount, total, paymentMethod, paymentStatus = 'pending', items
    } = req.body;

    // Asegúrate de que los campos requeridos estén presentes
    if (!customerName || !tableNumber || !items || items.length === 0) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const orderQuery = `
        INSERT INTO Orders (customerName, contact, deliveryAddress, tableNumber, orderMode, subtotal, discount, total, paymentMethod, paymentStatus)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(orderQuery, [customerName, contact, deliveryAddress, tableNumber, orderMode, subtotal, discount, total, paymentMethod, paymentStatus], (err, result) => {
        if (err) {
            console.error('Error al agregar el pedido:', err);
            return res.status(500).json({ error: 'Error al agregar el pedido' });
        }
        const orderId = result.insertId;
        const itemQueries = items.map(item => {
            return new Promise((resolve, reject) => {
                const itemQuery = `
                    INSERT INTO OrderItems (orderId, menuItemId, quantity)
                    VALUES (?, ?, ?)
                `;
                db.query(itemQuery, [orderId, item.id, item.quantity], (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                });
            });
        });
        Promise.all(itemQueries)
            .then(() => res.status(201).json({ id: orderId, customerName, total, status: 'pending' }))
            .catch(err => {
                console.error('Error al registrar los productos del pedido:', err);
                res.status(500).json({ error: 'Error al registrar los productos del pedido' });
            });
    });
});

app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { customerName, tableNumber, items } = req.body;
    const query = `
        UPDATE Orders SET customerName = ?, tableNumber = ?
        WHERE id = ?
    `;
    db.query(query, [customerName, tableNumber, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el pedido:', err);
            return res.status(500).json({ error: 'Error al actualizar el pedido' });
        }
        res.json({ message: 'Pedido actualizado' });
    });
});

app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;

    // Primero, elimina las referencias en OrderItems
    db.query('DELETE FROM OrderItems WHERE orderId = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar los productos del pedido:', err);
            return res.status(500).json({ error: 'Error al eliminar los productos del pedido' });
        }

        // Luego, elimina las referencias en Sales
        db.query('DELETE FROM Sales WHERE orderId = ?', [id], (err, result) => {
            if (err) {
                console.error('Error al eliminar las ventas del pedido:', err);
                return res.status(500).json({ error: 'Error al eliminar las ventas del pedido' });
            }

            // Finalmente, elimina el pedido
            db.query('DELETE FROM Orders WHERE id = ?', [id], (err, result) => {
                if (err) {
                    console.error('Error al eliminar el pedido:', err);
                    return res.status(500).json({ error: 'Error al eliminar el pedido' });
                }
                res.json({ message: 'Pedido eliminado' });
            });
        });
    });
});

// Rutas de usuarios
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).send('Error en la consulta a la base de datos');
        }
        res.json(results);
    });
});

app.post('/register', (req, res) => {
    const { username, email, document, password } = req.body;
    const rol = 'client';
    const query = 'INSERT INTO users (name, email, document, rol, pass) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [username, email, document, rol, password], (err, result) => {
        if (err) {
            console.error('Error al registrar el usuario:', err);
            return res.status(500).json({ error: 'Error al registrar el usuario' });
        }
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND pass = ?';
    
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error al iniciar sesión:', err);
            return res.status(500).json({ error: 'Error al iniciar sesión' });
        }
        
        if (results.length > 0) {
            const user = results[0];
            res.status(200).json({ message: 'Inicio de sesión exitoso', username: user.name });
        } else {
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    });
});

// Rutas de productos
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM Inventory', (err, results) => {
        if (err) {
            return res.status(500).send('Error en la consulta a la base de datos');
        }
        res.json(results);
    });
});

app.post('/api/products', (req, res) => {
    const { name, quantity, unit, alertLevel } = req.body;
    const query = 'INSERT INTO Inventory (name, quantity, unit, alertLevel) VALUES (?, ?, ?, ?)';
    db.query(query, [name, quantity, unit, alertLevel], (err, result) => {
        if (err) {
            console.error('Error al agregar el producto:', err);
            return res.status(500).json({ error: 'Error al agregar el producto' });
        }
        res.status(201).json({ id: result.insertId, name, quantity, unit, alertLevel });
    });
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Inventory WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el producto:', err);
            return res.status(500).json({ error: 'Error al eliminar el producto' });
        }
        res.json({ message: 'Producto eliminado' });
    });
});

// Ruta para obtener las ventas
app.get('/api/sales', (req, res) => {
    const query = `
        SELECT 
            m.name,
            m.price,
            SUM(oi.quantity) as totalSold,
            SUM(oi.quantity * m.price) as totalRevenue
        FROM Sales s
        JOIN Orders o ON s.orderId = o.id
        JOIN OrderItems oi ON o.id = oi.orderId
        JOIN Menu m ON oi.menuItemId = m.id
        GROUP BY m.id, m.name, m.price
        ORDER BY totalRevenue DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener las ventas:', err);
            return res.status(500).json({ error: 'Error al obtener las ventas' });
        }
        res.json(results);
    });
});

// Rutas de menú
app.get('/api/menu', (req, res) => {
    db.query('SELECT * FROM Menu WHERE available = TRUE', (err, results) => {
        if (err) {
            console.error('Error al obtener el menú:', err);
            return res.status(500).json({ error: 'Error al obtener el menú' });
        }
        res.json(results);
    });
});

app.post('/api/menu', (req, res) => {
    const { name, description, price, available } = req.body;
    const query = 'INSERT INTO Menu (name, description, price, available) VALUES (?, ?, ?, ?)';
    db.query(query, [name, description, price, available], (err, result) => {
        if (err) {
            console.error('Error al agregar el producto al menú:', err);
            return res.status(500).json({ error: 'Error al agregar el producto al menú' });
        }
        res.status(201).json({ id: result.insertId, name, description, price, available });
    });
});

app.put('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price, available } = req.body;
    const query = 'UPDATE Menu SET name = ?, description = ?, price = ?, available = ? WHERE id = ?';
    db.query(query, [name, description, price, available, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el producto del menú:', err);
            return res.status(500).json({ error: 'Error al actualizar el producto del menú' });
        }
        res.json({ message: 'Producto del menú actualizado' });
    });
});

app.delete('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Menu WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el producto del menú:', err);
            return res.status(500).json({ error: 'Error al eliminar el producto del menú' });
        }
        res.json({ message: 'Producto del menú eliminado' });
    });
});

// Agregar este nuevo endpoint para actualizar el estado de una orden
app.put('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Primero actualizamos el estado de la orden
    const updateOrderQuery = `
        UPDATE Orders 
        SET status = ?
        WHERE id = ?
    `;

    db.query(updateOrderQuery, [status, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el estado del pedido:', err);
            return res.status(500).json({ error: 'Error al actualizar el estado del pedido' });
        }

        // Si el estado es 'completed', registramos la venta
        if (status === 'completed') {
            const insertSaleQuery = `
                INSERT INTO Sales (orderId, customerName, total, paymentMethod)
                SELECT 
                    id,
                    customerName,
                    total,
                    paymentMethod
                FROM Orders
                WHERE id = ?
            `;

            db.query(insertSaleQuery, [id], (err, saleResult) => {
                if (err) {
                    console.error('Error al registrar la venta:', err);
                    return res.status(500).json({ error: 'Error al registrar la venta' });
                }
                res.json({ message: 'Pedido completado y venta registrada' });
            });
        } else {
            res.json({ message: 'Estado del pedido actualizado' });
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
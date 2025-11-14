const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const ExcelJS = require('exceljs');


const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Agustin1',
  database: 'laboratorio_inventario'
});

db.connect(err => {
  if (err) {
    console.error('❌ Error de conexión a MySQL:', err.message);
  } else {
    console.log('✅ Conectado a MySQL');
  }
});

app.get('/productos', (req, res) => {
  const sql = `
    SELECT 
      p.id,
      p.nombre,
      p.categoria,
      p.cantidad,
      p.unidad,
      p.ubicacion,
      p.precio,
      p.observaciones,
      pr.nombre AS proveedor
    FROM productos p
    LEFT JOIN proveedores pr ON p.proveedorId = pr.id
    ORDER BY p.nombre ASC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});


app.get('/productos/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT p.*, pr.nombre AS proveedor
    FROM productos p
    LEFT JOIN proveedores pr ON p.proveedorId = pr.id
    WHERE p.id = ?
  `;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(result[0]);
  });
});


app.post('/productos', (req, res) => {
  const { nombre, categoria, cantidad, unidad, ubicacion, proveedorId, precio, observaciones } = req.body;
  const sql = `
    INSERT INTO productos (nombre, categoria, cantidad, unidad, ubicacion, proveedorId, precio, observaciones)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [nombre, categoria, cantidad, unidad, ubicacion, proveedorId || null, precio || 0, observaciones || null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, ...req.body });
  });
});


app.put('/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, categoria, cantidad, unidad, ubicacion, proveedorId, precio, observaciones } = req.body;
  const sql = `
    UPDATE productos 
    SET nombre = ?, categoria = ?, cantidad = ?, unidad = ?, ubicacion = ?, proveedorId = ?, precio = ?, observaciones = ?
    WHERE id = ?
  `;
  db.query(sql, [nombre, categoria, cantidad, unidad, ubicacion, proveedorId || null, precio || 0, observaciones || null, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Producto actualizado correctamente' });
  });
});


app.delete('/productos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM productos WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Producto eliminado correctamente' });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

app.get('/proveedores', (req, res) => {
  const sql = 'SELECT * FROM proveedores';
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.get('/proveedores/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM proveedores WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json(result[0]);
  });
});

app.post('/proveedores', (req, res) => {
  const { nombre, contacto, telefono, email } = req.body;
  const sql = 'INSERT INTO proveedores (nombre, contacto, telefono, email) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, contacto, telefono, email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, ...req.body });
  });
});

app.put('/proveedores/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, contacto, telefono, email } = req.body;
  const sql = 'UPDATE proveedores SET nombre=?, contacto=?, telefono=?, email=? WHERE id=?';
  db.query(sql, [nombre, contacto, telefono, email, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Proveedor actualizado correctamente' });
  });
});

app.delete('/proveedores/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM proveedores WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Proveedor eliminado correctamente' });
  });
});

app.get('/movimientos', (req, res) => {
  const sql = `
    SELECT m.*, p.nombre AS nombre_producto
    FROM movimientos m
    JOIN productos p ON m.insumoId = p.id
    ORDER BY m.fecha DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.post('/movimientos', (req, res) => {
  const { insumoId, tipo, cantidad, motivo } = req.body;

  const sqlMovimiento = `
    INSERT INTO movimientos (insumoId, tipo, cantidad, motivo)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sqlMovimiento, [insumoId, tipo, cantidad, motivo], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const operacion = tipo === 'entrada' ? 'cantidad + ?' : 'cantidad - ?';
    const sqlUpdate = `UPDATE productos SET cantidad = ${operacion} WHERE id = ?`;

    db.query(sqlUpdate, [cantidad, insumoId], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: 'Movimiento registrado correctamente' });
    });
  });
});

app.get('/usuarios', (req, res) => {
  const sql = 'SELECT id, nombre, usuario, rol FROM usuarios';
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT id, nombre, usuario, rol FROM usuarios WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(result[0]);
  });
});

app.post('/usuarios', (req, res) => {
  const { nombre, usuario, contraseña, rol } = req.body;
  const sql = 'INSERT INTO usuarios (nombre, usuario, contraseña, rol) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, usuario, contraseña, rol || 'empleado'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, ...req.body });
  });
});

app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, usuario, contraseña, rol } = req.body;
  const sql = 'UPDATE usuarios SET nombre=?, usuario=?, contraseña=?, rol=? WHERE id=?';
  db.query(sql, [nombre, usuario, contraseña, rol, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Usuario actualizado correctamente' });
  });
});

app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM usuarios WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Usuario eliminado correctamente' });
  });
});

app.get('/reportes/stock-critico', (req, res) => {
  const sql = `
    SELECT nombre, categoria, cantidad, unidad, ubicacion
    FROM productos
    WHERE categoria LIKE '%reactivo%' AND cantidad < 10
    ORDER BY cantidad ASC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.get('/reportes/consumo', (req, res) => {
  const sql = `
    SELECT i.nombre AS insumo, SUM(m.cantidad) AS total_consumido
    FROM movimientos AS m
    JOIN productos AS i ON m.insumoId = i.id
    WHERE m.tipo = 'salida'
    GROUP BY i.nombre
    ORDER BY total_consumido DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.get('/reportes/exportar-insumos', async (req, res) => {
  const sql = `
    SELECT p.id, p.nombre, p.categoria, p.cantidad, p.unidad, p.ubicacion, 
           pr.nombre AS proveedor
    FROM productos p
    LEFT JOIN proveedores pr ON p.proveedorId = pr.id
    ORDER BY p.categoria ASC, p.nombre ASC
  `;

  db.query(sql, async (err, productos) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();

    const colores = {
      "Instrumentos y equipos": "FFE6CC",
      "reactivos organicos solidos": "FFCCCC",
      "reactivos organicos liquido": "FFDDCC",
      "reactivos inorganicos solidos": "CCE5FF",
      "reactivos inorganicos liquidos": "CCFFFF",
      "soluciones y mas": "E6FFCC",
      "material de vidrio": "F2E6FF",
      "material de plastico": "FFF2CC"
    };

    const categorias = [...new Set(productos.map(p => p.categoria))];

    categorias.forEach(categoria => {
      const sheet = workbook.addWorksheet(categoria.substring(0, 31));

      const header = [
        "ID",
        "Nombre",
        "Categoría",
        "Cantidad",
        "Unidad",
        "Ubicación",
        "Proveedor"
      ];

      const headerRow = sheet.addRow(header);

      headerRow.eachCell(cell => {
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "DDDDDD" }
        };
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        };
      });

      productos
        .filter(p => p.categoria === categoria)
        .forEach(p => {
          const row = sheet.addRow([
            p.id,
            p.nombre,
            p.categoria,
            p.cantidad,
            p.unidad,
            p.ubicacion,
            p.proveedor || "Sin proveedor"
          ]);

          row.eachCell(cell => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: colores[categoria] || "FFFFFF" }
            };
          });
        });

      sheet.columns.forEach(column => {
        column.width = 20;
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=reporte_insumos.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  });
});



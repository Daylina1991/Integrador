
const { poolPromise, sql } = require('../config/db');

class ProductoRepository {
  // Consulta SELECT: Obtener todos los productos
  async getAll() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Productos');
    return result.recordset;
  }

  // Consulta SELECT: Obtener un producto por ID
  async getById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Productos WHERE id = @id');
    return result.recordset;
  }

  // Consulta INSERT: Crear un nuevo producto
  async create(producto) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('nombre', sql.VarChar, producto.nombre)
      .input('descripcion', sql.VarChar, producto.descripcion)
      .input('precio', sql.Decimal(10, 2), producto.precio)
      .input('stock', sql.Int, producto.stock)
      .input('imagenUrl', sql.VarChar, producto.imagenUrl)
      .query(`
        INSERT INTO Productos (nombre, descripcion, precio, stock, imagenUrl)
        VALUES (@nombre, @descripcion, @precio, @stock, @imagenUrl);
        SELECT SCOPE_IDENTITY() AS id;
      `);
    return { id: result.recordset.id, ...producto };
  }
}

module.exports = new ProductoRepository();


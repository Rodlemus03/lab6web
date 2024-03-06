import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'mysql',
  port: 3306,
  user: 'root',
  password: 'pelu1503',
  database: 'blog_musica',
});
/*
async function createTable() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        plataforma VARCHAR(200) NOT NULL,
        cancion VARCHAR(200) NOT NULL
      )
    `);
    connection.release();
    console.log('Tabla creada correctamente.');
  } catch (error) {
    console.error('Error al crear la tabla blog_posts:', error);
  }
}*/

// Ejecuta la función para crear la tabla al iniciar la aplicación
//createTable();

export default pool;

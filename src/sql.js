import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  port: 33069,
  user: 'root',
  database: 'blog_musica',
  password: 'pelu1503'
})

async function createTable() {
  const connection = await pool.getConnection()
  try {
    await connection.query(`
            CREATE TABLE IF NOT EXISTS blog_posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                plataforma VARCHAR(200) NOT NULL,
                cancion VARCHAR(200) NOT NULL
            )
        `)
  } catch (error) {
    console.error('Error al crear la tabla blog_posts:', error)
  } finally {
    connection.release()
  }
}

pool.getConnection()
  .then(async (connection) => {
    await createTable()
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error)
  })

export default pool

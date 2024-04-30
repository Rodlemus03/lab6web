import pool from './sql.js'

// Crear un nuevo usuario
async function createUser(user, passw) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      'INSERT INTO users (user, passw) VALUES (?, ?)',
      [user, passw]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Autenticar un usuario
async function authenticateUser(user, passw) {
  const connection = await pool.getConnection();
  console.log(user)
  console.log(passw)
  try {
    const [rows] = await connection.query(
      'SELECT * FROM users WHERE user = ? AND passw = ?',
      [user, passw]
    );
    return rows.length > 0; // Si hay al menos un usuario con ese nombre de usuario y contraseña, la autenticación es exitosa
  } catch (error) {
    console.error('Error al autenticar el usuario:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Crear un nuevo post
async function createPost(title, content, plataforma, cancion) {
  const connection = await pool.getConnection()
  try {
    const [result] = await connection.query(
      'INSERT INTO blog_posts (title, content, plataforma, cancion) VALUES (?, ?, ?, ?)',
      [title, content, plataforma, cancion]
    )
    return result.insertId
  } catch (error) {
    console.error('Error al crear el post:', error)
    throw error
  } finally {
    connection.release()
  }
}

// Obtener todos los posts
async function getPosts() {
  const connection = await pool.getConnection()
  try {
    const [rows] = await connection.query('SELECT * FROM blog_posts')
    return rows
  } catch (error) {
    console.error('Error al obtener los posts:', error)
    throw error
  } finally {
    connection.release()
  }
}

// Obtener un post por su ID
async function getPostById(id) {
  const connection = await pool.getConnection()
  try {
    const [rows] = await connection.query('SELECT * FROM blog_posts WHERE id = ?', [id])
    return rows[0]
  } catch (error) {
    console.error('Error al obtener el post:', error)
    throw error
  } finally {
    connection.release()
  }
}

// Actualizar un post
async function updatePost(id, title, content, plataforma, cancion) {
  const connection = await pool.getConnection()
  try {
    await connection.query(
      'UPDATE blog_posts SET title = ?, content = ?, plataforma = ?, cancion = ? WHERE id = ?',
      [title, content, plataforma, cancion, id]
    )
  } catch (error) {
    console.error('Error al actualizar el post:', error)
    throw error
  } finally {
    connection.release()
  }
}

// Borrar un post
async function deletePost(id) {
  const connection = await pool.getConnection()
  try {
    await connection.query('DELETE FROM blog_posts WHERE id = ?', [id])
  } catch (error) {
    console.error('Error al borrar el post:', error)
    throw error
  } finally {
    connection.release()
  }
}

export {
  createPost, getPosts, getPostById, updatePost, deletePost,createUser,authenticateUser
}

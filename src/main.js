import express from 'express'
import {
  createPost, getPosts, getPostById, updatePost, deletePost
} from './crud.js'

const app = express()
const PORT = 3000

app.use(express.json())

// Ruta para crear un nuevo post
app.post('/api/posts', async (req, res) => {
  const {
    title, content, plataforma, cancion
  } = req.body
  try {
    if (!title || !content || !plataforma || !cancion) {
      return res.status(400).json({ error: 'Se requieren todos los campos (title, content, plataforma, cancion)' })
    }
    const postId = await createPost(title, content, plataforma, cancion)
    res.status(201).json({ id: postId, message: 'Post creado correctamente' })
  } catch (error) {
    console.error('Error al crear el post:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Ruta para obtener todos los posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await getPosts()
    res.status(200).json(posts)
  } catch (error) {
    console.error('Error al obtener los posts:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Ruta para obtener un post por su ID
app.get('/api/posts/:id', async (req, res) => {
  const postId = req.params.id
  try {
    const post = await getPostById(postId)
    if (!post) {
      res.status(404).json({ error: 'Post no encontrado' })
    } else {
      res.status(200).json(post)
    }
  } catch (error) {
    console.error('Error al obtener el post:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Ruta para actualizar un post por su ID
app.put('/api/posts/:id', async (req, res) => {
  const postId = req.params.id
  const {
    title, content, plataforma, cancion
  } = req.body
  try {
    if (!title || !content || !plataforma || !cancion) {
      return res.status(400).json({ error: 'Se requieren todos los campos (title, content, plataforma, cancion)' })
    }
    await updatePost(postId, title, content, plataforma, cancion)
    res.status(200).json({ message: 'Post actualizado correctamente' })
  } catch (error) {
    console.error('Error al actualizar el post:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Ruta para eliminar un post por su ID
app.delete('/api/posts/:id', async (req, res) => {
  const postId = req.params.id
  try {
    await deletePost(postId)
    res.status(200).json({ message: 'Post eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar el post:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Manejar método no implementado
app.all('/api/posts', (req, res) => {
  res.status(501).json({ error: 'Método no implementado' })
})

// Manejar rutas no existentes
app.use('*', (req, res) => {
  res.status(400).json({ error: 'Ruta no encontrada' })
})

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://127.0.0.1:${PORT}`)
})
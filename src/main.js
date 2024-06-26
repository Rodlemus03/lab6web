import express from 'express';
import cors from  'cors';
import yaml from 'js-yaml'
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import {  createPost, getPosts, getPostById, updatePost, deletePost,createUser,authenticateUser} from './crud.js';
import jwt from 'jsonwebtoken';


const app = express();
const PORT = 3000;
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://127.0.0.1:${PORT}`);
  console.log(`Documentacion de apis disponible en: http://127.0.0.1:${PORT}/api-docs`);
});


app.use(express.json());

app.use(cors());



//Secrete key
const JWT_SECRET_KEY = "LlaveSecretaJulioWeb2024";

// Ruta para generar y enviar un token JWT
app.post('/api/get-token', async (req, res) => {
  const userId = req.body.userId; // Supongamos que recibes el userId en el cuerpo de la solicitud
  try {
    const token = jwt.sign({ userId }, JWT_SECRET_KEY, { expiresIn: '1h' }); // Genera un token que expira en 1 hora
    res.status(200).json({ token }); // Envía el token en la respuesta
  } catch (error) {
    console.error('Error al generar el token:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    console.error('Token de autenticación no proporcionado');
    return;
  }

  const tokenWithoutBearer = token.split(' ')[1];

  jwt.verify(tokenWithoutBearer, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('Token inválido:', err.message);
      return;
    }
    console.log('Token válido');
    req.user = decoded;
    next();
  });
};




// Cargar el archivo YAML de Swagger
const swaggerDocument = yaml.load(fs.readFileSync('src/api-docs/swagger.yml', 'utf8'));

// Middleware para servir la documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Ruta para crear un nuevo usuario
app.post('/api/users', async (req, res) => {
  const { user, passw } = req.body;
  try {
    if (!user || !passw) {
      return res.status(400).json({ error: 'Se requieren el nombre de usuario y la contraseña' });
    }
    const userId = await createUser(user, passw);
    res.status(201).json({ id: userId, message: 'Usuario creado correctamente' });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para autenticar un usuario
app.post('/api/authenticate', async (req, res) => {
  const { user, passw } = req.body;
  console.log(user)
  console.log(passw)
  try {
    const isAuthenticated = await authenticateUser(user, passw);
    if (isAuthenticated) {
      res.status(200).json({ message: 'Autenticación exitosa' });
    } else {
      res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al autenticar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Middleware para escribir en el archivo de log
const loggerMiddleware = (req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    payload: req.body
  };
  const logEntry = JSON.stringify(logData) + '\n';

  fs.appendFile('log.txt', logEntry, (err) => {
    if (err) {
      console.error('Error al escribir en el archivo de registro:', err);
    }
  });

  next();
};

// Agregar el middleware de registro a todas las rutas
app.use(loggerMiddleware);

// Ruta para crear un nuevo post
app.post('/api/posts', authenticateJWT,async (req, res) => {
  const {
    title, content, plataforma, cancion
  } = req.body;
  try {
    if (!title || !content || !plataforma || !cancion) {
      return res.status(400).json({ error: 'Se requieren todos los campos (title, content, plataforma, cancion)' });
    }
    const postId = await createPost(title, content, plataforma, cancion);
    res.status(201).json({ id: postId, message: 'Post creado correctamente' });
  } catch (error) {
    console.error('Error al crear el post:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para obtener todos los posts
app.get('/api/posts',authenticateJWT, async (req, res) => {
  try {
    const posts = await getPosts();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error al obtener los posts:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para obtener un post por su ID
app.get('/api/posts/:id', authenticateJWT,async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await getPostById(postId);
    if (!post) {
      res.status(404).json({ error: 'Post no encontrado' });
    } else {
      res.status(200).json(post);
    }
  } catch (error) {
    console.error('Error al obtener el post:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para actualizar un post por su ID
app.put('/api/posts/:id',authenticateJWT, async (req, res) => {
  const postId = req.params.id;
  const {
    title, content, plataforma, cancion
  } = req.body;
  try {
    if (!title || !content || !plataforma || !cancion) {
      return res.status(400).json({ error: 'Se requieren todos los campos (title, content, plataforma, cancion)' });
    }
    await updatePost(postId, title, content, plataforma, cancion);
    res.status(200).json({ message: 'Post actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el post:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para eliminar un post por su ID
app.delete('/api/posts/:id',authenticateJWT, async (req, res) => {
  const postId = req.params.id;
  try {
    await deletePost(postId);
    res.status(200).json({ message: 'Post eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el post:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Manejar método no implementado
app.all('/api/posts', (req, res) => {
  res.status(501).json({ error: 'Método no implementado' });
});

// Manejar rutas no existentes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware para manejar errores de formato de datos en el cuerpo de la solicitud
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).json({ error: 'Formato de datos incorrecto en el cuerpo de la solicitud' });
  } else {
    next();
  }
});


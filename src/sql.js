import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'mysql',
  port: 3306,
  user: 'root',
  password: 'pelu1503',
  database: 'blog_musica',
});


export default pool;

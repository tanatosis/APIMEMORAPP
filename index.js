import { PORT } from './config.js'
import express from "express";
import pg from "pg";
import bcrypt from "bcrypt";
import {
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_USER,
    DB_PASSWORD

} from './config.js'

const app = express();
const { Pool } = pg;
app.use(express.json());

const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: DB_PORT
});

pool.connect()
    .then(client => {
        console.log('Conexión exitosa');
        client.release(); // Importante: liberar el cliente después de usarlo
    })
    .catch(err => console.error('Error al conectarse a la base de datos', err.stack));




app.listen(PORT, () => {
    console.log('conectado al puerto', PORT);
});

app.get("/api/v1/personas", async(req, res) => {
    const resultado = await pool.query("SELECT u.id, u.username, u.password, u.email, SUM(cd.watts) as total_consumo FROM users u LEFT JOIN areas a ON u.id = a.id_usuario LEFT JOIN consumo_diario cd ON cd.id_area = a.id_area GROUP BY u.id ORDER BY id");
    res.json(resultado.rows);
});

app.post("/api/v1/personas", async(req, res) => {
    const { username, password } = req.body;

    const resultado = await pool.query("insert into users (username, password, id_rol) values($1,$2,$3) RETURNING id", [username, password, 2]);

    res.json({ id: resultado.rows[0].id });
});

app.post("/api/v1/login", async(req, res) => {
    const { username, password } = req.body;

    const result = await pool.query('SELECT username, password,id_rol FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
        res.json({ success: false, message: 'Usuario o contraseña incorrectos.' });
    } else {
        const validPassword = await bcrypt.compare(password, user.password);

        if (validPassword) {
            res.json({ success: true, user: { id: user.id, username: user.username, role: user.id_rol } });
        } else {
            res.json({ success: false, message: 'Usuario o contraseña incorrectos.' });
        }
    }
});
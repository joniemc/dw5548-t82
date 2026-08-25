const express = require('express');
const app = express();
const mysql = require('mysql2');
const PORT = 3000;

const pool = mysql.createPool({
    host:'localhost',
    user: 'root',
    password:'R00tP4ssw0rd',
    database:'Libreria'
});

pool.getConnection((error, conexion)=>{
    if(error){
        console.log('Error de conexión con la base de datos...');
    }
    else{
        console.log('Conexión exitosa');
    }
});

app.use(express.json());

app.listen(PORT, ()=>{
    console.log(`El sevidor esta escuchando en: http://localhost:${PORT}`);
});
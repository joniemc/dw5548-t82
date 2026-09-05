const express = require('express');
const app = express();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PORT = 3000;
const JWT_SECRET_KEY = 'MyHASH_SUPER_SECRRETO';
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

const authMiddleware = (req, res, next)=>{
    const authHeader = req.headers['token'];
    console.log("Aqui el encabezado: ",authHeader);

    if(!authHeader){
        return res.status(401).json({status:401, message:"No autorizado..."});
    }

    next();
}

app.use(express.json());

app.get('/gethash/:plaintext', async (req, res)=>{
    const plaintext = req.params.plaintext;

    const saltRound = 10;
    const hash = await bcrypt.hash(plaintext, saltRound);

    res.send(hash);
});


app.post('/login',async (req, res)=>{
    const user = req.body;

    const sql = "SELECT Username, Password, Correo FROM Usuario WHERE Username = ? AND Estado = 1";

    pool.query(sql, [user.Username], async (err, results)=>{
        if(err){
            return res.status(500).json({status:500, message:"Ocurrio un error en la ejecución de la consulta"});
        }

        if(results.length === 0){
            return res.status(401).json({status:401, message:"Credenciales invalidas o usuario inactivo..."});
        }

        let cUser = results[0];
        const isMatch = await bcrypt.compare(user.Password, cUser.Password);

        if(!isMatch){
            return res.status(401).json({status:401, message:"Credenciales invalidas o usuario inactivo..."});
        }

        //Generamos el token
        const token = jwt.sign({username: cUser.Username, email: cUser.Correo}, JWT_SECRET_KEY, {expiresIn:'1h'});

        return res.status(200).json({status:200,message:"Success", data: token});
    });
});

app.get('/usuarios', authMiddleware, (req,res)=>{
    

    const sql = "SELECT Id, Username, Estado, Correo FROM Usuario";

    pool.query(sql,(err, results)=>{
        if(err){
            res.status(500).json({status:500, message:"Ocurrio un error en la ejecución de la consulta"});
        }
        else{
            res.status(200).json({status:200,message:"Success",data:results});
        }
    });
});

app.get('/usuarios/:Username',authMiddleware, (req,res)=>{

    const username = req.params.Username;
    const sql = "SELECT Id, Username, Estado, Correo FROM Usuario WHERE Username=? ";

    pool.query(sql,[username],(err,results)=>{
        if(err){
            res.status(500).json({status:500, message:"Ocurrio un error en la ejecución de la consulta"});
        }
        else{
            res.status(200).json({status:200,message:"Success",data:results});
        }
    });
});

app.post('/usuarios', (req, res)=>{
    const usuario = req.body;

    const sql = "INSERT INTO Usuario (Username, Password, Estado, Correo) VALUES(?, ?,?,?)";
    pool.query(sql,[usuario.Username,usuario.Password, usuario.Estado, usuario.Correo],(err, results)=>{
        if(err){
            res.status(500).json({status:500, message:"Ocurrio un error en la ejecución de la consulta"});
        }else{
            usuario.Id = results.insertId;
            res.status(200).json({status:200,message:"Success",data:usuario});
        }
    });
});

app.put('/usuarios/:Id', (req,res)=>{
    const Id = req.params.Id;
    const usuario = req.body;

    const sql = "UPDATE Usuario SET Username = ?, Estado=?, Correo=? WHERE Id = ?";

    pool.query(sql, [usuario.Username, usuario.Estado, usuario.Correo, Id], (err, results)=>{
        if(err){
            res.status(500).json({status:500, message:"Ocurrio un error en la ejecución de la consulta"});
        }
        else if(results.affectedRows === 0){
            res.status(404).json({status:404, message:"Usuario no encontrado..."});
        }
        else{
            res.status(200).json({status:200,message:"Success",data:usuario});
        }
    });
});

app.delete('/usuarios/:Id', (req,res)=>{
    const Id = req.params.Id;

    const sql = "DELETE FROM Usuario WHERE Id = ?";

    pool.query(sql, [Id], (err, results)=>{
        if(err){
            res.status(500).json({status:500, message:"Ocurrio un error en la ejecución de la consulta"});
        }
        else if(results.affectedRows === 0){
            res.status(404).json({status:404, message:"Usuario no encontrado..."});
        }
        else{
            res.status(200).json({status:200,message:"Registro eliminado exitosamente"});
        }
    });
});


app.listen(PORT, ()=>{
    console.log(`El sevidor esta escuchando en: http://localhost:${PORT}`);
});
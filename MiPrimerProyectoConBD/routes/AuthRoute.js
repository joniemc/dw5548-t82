const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/db.js');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

router.post('/login',async (req, res)=>{
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

module.exports = router;
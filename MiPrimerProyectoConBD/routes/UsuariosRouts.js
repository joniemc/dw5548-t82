const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db.js');
const authMiddleware =require('../middleware/AuthMiddleware.js');

router.get('/usuarios', authMiddleware, (req,res)=>{
    

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

router.get('/usuarios/:Username',authMiddleware, (req,res)=>{

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

router.post('/usuarios',authMiddleware, async (req, res)=>{
    const usuario = req.body;

    const sql = "INSERT INTO Usuario (Username, Password, Estado, Correo) VALUES(?, ?,?,?)";

    const saltRound = 10;
    const hash = await bcrypt.hash(usuario.Password, saltRound);

    pool.query(sql,[usuario.Username,hash, usuario.Estado, usuario.Correo],(err, results)=>{
        if(err){
            res.status(500).json({status:500, message:"Ocurrio un error en la ejecución de la consulta"});
        }else{
            usuario.Id = results.insertId;
            res.status(200).json({status:200,message:"Success",data:usuario});
        }
    });
});

router.put('/usuarios/:Id',authMiddleware, (req,res)=>{
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

router.delete('/usuarios/:Id',authMiddleware, (req,res)=>{
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

module.exports = router;

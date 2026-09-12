const express = require('express');
const axios = require('axios');
const app = express();
const bcrypt = require('bcrypt');

const AuthRoute = require('./routes/AuthRoute.js');
const UsuariosRoutes = require('./routes/UsuariosRouts.js');
const PORT = 3000;

require('dotenv').config();

app.use(express.json());

app.get('/gethash/:plaintext', async (req, res)=>{
    const plaintext = req.params.plaintext;

    const saltRound = 10;
    const hash = await bcrypt.hash(plaintext, saltRound);

    res.send(hash);
});

app.get('/api/posts',async (req, res)=>{
    try{
        let url = process.env.ENDPOINT_API_TERCEROS+'/posts';
        console.log(url);

        const rersponseAxios = await axios.get(url);
        let posts = rersponseAxios.data;

        return res.status(200).json({status:200, message:'Success', data: posts});


    }catch(error){
        return res.status(500).json({status:500, message:'Ocurrui un error inesperado intentelo mas tarde..'});
    }
});

 app.post('/api/posts',async (req, res)=>{
    const post = req.body;
    try{
        let url = process.env.ENDPOINT_API_TERCEROS+'/posts';
        const rersponseAxios = await axios.post(url, post);

        return res.status(200).json({status:200, message:'Success', data: rersponseAxios.data});

    }catch(error){
        return res.status(500).json({status:500, message:'Ocurrui un error inesperado intentelo mas tarde..'});
    }
    
 });

app.use('/', AuthRoute);
app.use('/',UsuariosRoutes);

app.listen(PORT, ()=>{
    console.log(`El sevidor esta escuchando en: http://localhost:${PORT}`);
});
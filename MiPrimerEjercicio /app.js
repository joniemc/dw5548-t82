const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res)=>{
    
    res.send('Hello world desde express...');
});

/*app.get('/:miparametro', (req, res)=>{
    const miparametro = req.params.miparametro;
    res.send(`Lectura del parametro: ${miparametro}`);
});*/

app.get('/querystring',(req, res)=>{
    const valor = req.query.valor;
    res.send(`El valor es: ${valor}`);
});

app.get('/ejerciciojson',(req, res)=>{
    res.status(400).json({status:400,message:"Ocurrio un error contacte con el administrador del sistema"});
});

app.listen(PORT, ()=>{
    console.log(`El sevidor esta escuchando en http://localhost:${PORT}`);
});
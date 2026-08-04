const express = require('express');
const app = express();
const PORT = 3001;

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

app.listen(PORT, ()=>{
    console.log(`El sevidor esta escuchando en http://localhost:${PORT}`);
});
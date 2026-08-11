const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

function obtenerProductos(){
    const data = fs.readFileSync('productos.json','utf-8');
    return JSON.parse(data);
}

function registrarProductos(productos){
    fs.writeFileSync('productos.json',JSON.stringify(productos, null, 2));
}

app.get("/productos",(req, res)=>{
    let productos = obtenerProductos();

    res.status(200).json({status:200,message:"Success",data:productos});
});

app.post("/productos",(req, res)=>{
    const producto = req.body;
    let productos = obtenerProductos();
    productos.push(producto);

    registrarProductos(productos);

    res.status(200).json({status:200,message:"Success", data:producto});

});

app.listen(PORT,()=>{
    console.log(`El servidor escucha en: http://localhost:${PORT}`);
});
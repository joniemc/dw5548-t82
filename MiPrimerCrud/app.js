const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const users = [{nombre:"Jonie Miralda", edad: 30, correo: "jmiralda@unitec.edu"},{nombre:"Candido Amaya", edad: 24, correo: "candido.amaya@unitec.edu"}];

app.get("/user",(req, res)=>{
    res.status(200).json({status:200,message:"Success",data: users});
});

app.get("/user/:correo",(req, res)=>{
    const correo = req.params.correo;
    
    let isActive = false;
    
    users.forEach(user => {
        if(user.correo === correo){
            isActive = true;
            return res.status(200).json({status:200, message:"Success", data:user});
        }

    });

    if(!isActive){
        return res.status(404).json({status:404, message:"Registro no encontrado", data:null});
    }

});

app.post("/user", (req,res)=>{
    const user = req.body;

    console.log(user);

    users.push(user);
    
    res.status(200).json({status:200,message:"Success",data: user});
});

app.put("/user",(req, res)=>{
    const user = req.body;

    let isActive = false;
    
    users.forEach(cuser => {
        if(cuser.correo === user.correo){
            isActive = true;
            cuser.nombre = user.nombre;
            cuser.edad = user.edad;  
        }

    });

    if(isActive){
        return res.status(200).json({status:200, message:"Success", data:user});
    }else{
        return res.status(404).json({status:404, message:"Registro no encontrado", data:null});
    }

});
app.listen(PORT, ()=>{
    console.log(`El servidor de express esta escuchando en http://localhost:${PORT}`);
});
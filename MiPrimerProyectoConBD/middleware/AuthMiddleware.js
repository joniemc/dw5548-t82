const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authMiddleware = (req, res, next)=>{
    const authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(401).json({status:401, message:"No autorizado, el token es obligatorio.."});
    }

    if(!authHeader.startsWith('Bearer ')){
        return res.status(401).json({status:401, message:"No autorizado, el token no cuenta con un formato valido.."});
    }

    const token = authHeader.split(' ')[1];    

    jwt.verify(token, JWT_SECRET_KEY, (err, user)=>{
        if(err){
            return res.status(401).json({status:401, message:"No autorizado, token invalido.."});
        }    

        req.user = user;
        next();
    });

}

module.exports = authMiddleware;
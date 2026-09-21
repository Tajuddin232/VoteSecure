const jwt = require('jsonwebtoken');

const jwtAuthentication = (req,res,next) =>{
    
    const token = req.headers.authorization.split(' ')[1];
    if(!token) 
        return res.status(401).json({error : "NO TOKEN"});
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        console.error(err);
        res.status(401).json({err : 'Invalid token'});
    }
}

const generateJwtKey = (userData) =>{
    return jwt.sign(userData,process.env.JWT_SECRET);
}

module.exports = {jwtAuthentication,generateJwtKey};
const { response } = require('express');
const jwt=require('jsonwebtoken');

const jwtAuthMiddleware= (req,res,next)=>{

    //first check request headers has authorization or not
    const authorization=req.headers.authorization;
    if(!authorization)
        return res.status(401).json({error:'Token not found'});

    // Extract the jwt token from the reques header
    const token= req.headers.authorization.split(' ')[1];
    
    if(!token)
    {
        return res.status(401).json({ error:'Unauthorized'});
    }
    try{
        // verify the token
        
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded; // req.user is not mandatory whatever you want like req.payload, req.jwt etc.
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).json({error:'Invalid Token'});
    }
}
// //Function to generate jwt token
// const generateToken = (userdata)=>{
//     return jwt.sign(userdata,process.env.JWT_SECRET);
// } 
//Function to generate jwt token with expire
const generateToken = (userdata)=>{
    return jwt.sign(userdata,process.env.JWT_SECRET,{expiresIn:300000}); // expiry in 30 secs.
} 

module.exports={jwtAuthMiddleware,generateToken};
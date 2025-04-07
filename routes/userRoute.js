const express = require('express');
const router =express.Router();
const user=require('./../models/user'); // ../ means two folder pi6ee save a6e bole

const {jwtAuthMiddleware,generateToken} = require('./../jwt');

// post route to add a person
router.post('/signup', async(req,res)=>{

    try{
    const data=req.body; // req body containo the user data

    // create a newperson and copy the data which is user input in data=req.body;
    const newUser = new user(data);

    // save the newPerson to the database
    const response = await newUser.save();
    console.log('data saved');
    const payload={
      id: response.id
    }  

    const token= generateToken(payload); // we want to pass username in payload.
    console.log("Token is : ", token);

    res.status(200).json({response: response, token : token});
    }
    catch(err){
      console.log(err);
      res.status(500).json({error:"Internal Server Error"});
    }
});

// Login Route
router.post('/login', async(req,res)=>{
  try{
      //Extract aaharCardNumber and password form req.body
      const{aaharCardNumber,password}=req.body;

      // Find the user by aaharCardNumber 
      const user= await user.findOne({aaharCardNumber: aaharCardNumber});

      //if user doesnot exist and password does not match, return err
      if(!user || !(await user.comparePassword(password))){ // comparepassword is not inbuild functin it is userdefined in 
        return res.status(401).json({error:"invailid aaharCardNumber or password"});
      }
      const payload={
        id:user.id,
      }
      const token=generateToken(payload);

      // return token as response
      res.json({token});
  }
  catch(err){
    console.log(err);
    res.status(500).json({error:"internal server error"});
  }
});

// Profile Routes
router.get('/profile',jwtAuthMiddleware, async(req,res)=>{

    try{
      const userData=req.user;

      const userId=userData.id;
      const user = await user.findById(userId);

      res.status(200).json(user);
      
    }
    catch(err){
      console.log(err);
      res.status(404).json({error:'Internal server error'});
    }
});


// for update the value 
router.put('/profile/password',jwtAuthMiddleware, async(req,res)=>{
  try{
    const userId=req.user; // extract the token from the url 
    const {currentPassword,newPassword}=req.body;

    //Find the user by userid
    const user= await user.findById(userId);

    //if  password does not match, return err
    if(!(await user.comparePassword(currentPassword))){
        return res.status(401).json({error:"invailid  password"});
    }

    // update the users password
    user.password=newPassword;
    await user.save();


    console.log('Password Updated');
    res.status(200).json({message: "password Updated"});
  }
  catch(err){
      console.log(err);
      res.status(404).json({error:"Internal server error"});
  }
});


module.exports=router;
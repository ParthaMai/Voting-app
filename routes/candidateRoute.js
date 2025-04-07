const express = require('express');
const router =express.Router();
const person=require('./../models/candidate'); // ../ means two folder pi6ee save a6e bole

const {jwtAuthMiddleware,generateToken} = require('./../jwt');
const candidate = require('../models/candidate');
const user = require('../models/user');

const checkAdminRole = async (userID) => {
    try{
        const User = await user.findById(userID);
        if(User.role === 'admin'){
            return true;
        }
    }
    catch(err){
        return false;
    }
}

// post route to add a candidate
router.post('/',jwtAuthMiddleware, async(req,res)=>{
    
    try{
        if(! await checkAdminRole(req.user.id)){ // this is check user is admin or voter
            res.status(404).json({message: "user has not admin role"});
        }
    
    const data=req.body; // the req.body contains the candidate data.

    // create a newcandidate and copy the data which is user input in data=req.body;
    const newCandidate = new candidate(data);

    // save the newCandidate to the database
    const response = await newCandidate.save();
    console.log('data saved');
    
    res.status(200).json({response: response});
    }
    catch(err){
      console.log(err);
      res.status(500).json({error:"Internal Server Error"});

    }

});

// for update the value 
router.put('/:candidateID',jwtAuthMiddleware, async(req,res)=>{
  
    try{
        if(! await checkAdminRole(req.user.id)){ // this is check user is admin or not
            res.status(404).json({message: "user has not admin role"});
        }

    const candidateId=req.params.candidateID; // extract the from the url
    const updatecandidateData=req.body; // update data for the person

    const response = await candidate.findByIdAndUpdate(candidateId,updatecandidateData,{ // this function is inbuilt function
      new: true, //  return the update document
      runValidators: true, // Run mongoose validatin means check the candidate scehma
    })
    if(!response)
    {
      return res.status(404).json({error:'candidate not found'});
    }
    console.log(' candidate data Updated');
    res.status(200).json(response);
  }
  catch(err){
      console.log(err);
      res.status(404).json({error:"Internal server error"});
  }
});


// for delete the value
router.delete('/:candidateID',jwtAuthMiddleware, async(req,res)=>{
 
    try{
        if(! await checkAdminRole(req.user.id)){ // this is check user is admin or not
            res.status(404).json({message: "user has not admin role"});
        }

      const candidateId=req.params.candidateID;

      const response= await candidate.findByIdAndDelete(candidateId);
      if(!response)
        {
          return res.status(404).json({error:'candidate not found'});
        }
        console.log(' candidate data deleted');
        res.status(200).json(response);
  }
  catch(err){
    console.log(err);
    res.status(404).json({error:"Internal server error"});
  }
})

// Voting 
router.post('/vote/:candidateID',jwtAuthMiddleware, async(req,res) =>{
    // no admin can vote
    // user vote only one time

    candidateID=req.params.candidateID;
    userID=req.user.id;

    try{
        const Candidate= await candidate.findById(candidateID);
        if(!Candidate)
        {
            return res.status(404).json({message:'candidate not found'});
        }

        const User= await user.findById(userID);
        if(!User){
            return res.status(404).json({message:'user not found'});
        }
        if(User.isVoted){
            res.status(400).json({message:'You have already voted'});
        }

        if(User.role== 'admin'){
            res.status(403).json({message:'admin is not allowed'});
        }

        // update the candidate document to record the vote
        Candidate.votes.push({User: userID});
        Candidate.voteCount++;
        await Candidate.save();

        //update the user document
        User.isVoted=true;
        await User.save(); //save the user data

        res.status(200).json({message: "vote recorded Sucessfully"});

    }catch(err){
        console.log(err);
        res.status(400).json({error:"internal server erorr"});
    }

});


// vote count
router.get('/vote/count', async (req,res)=>{
    try{
        //find all candidate and short them by vote count
        const Candidate= await candidate.find().sort({voteCount: 'desc'});

        // Map the candidates to only return their name and voteCount
        const voteRecord = Candidate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(voteRecord);

    }catch(err){
        console.log(err);
        res.status(400).json({error:"internal server erorr"});
    }
})


module.exports=router;
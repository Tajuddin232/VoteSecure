const express = require('express');

const router = express.Router();

const User = require('./../models/user');

const {jwtAuthentication,generateJwtKey} = require('./../jwt');

router.post('/signUp', async(req,res)=>{
    try{
        const data = req.body;
        const newUser = new User(data);

        const response = await newUser.save();
        console.log("Data Saved");

        const payload = {
            id : response.id
        }
        const token = generateJwtKey(payload);
        console.log("token : ",token);
        res.status(200).json({response : response, token:token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : "Internal server error"});
    }
});

router.post('/login', async (req,res)=>{
    try{
        const {aadharCardNumber,password} = req.body;

        const user = await User.findOne({aadharCardNumber:aadharCardNumber});

        if(!user || !(await user.comparePassword(password))){
            console.log("User not Found");
            return res.status(401).json({error: "Invalid user"});
        }

        const payload = {
            id : user.id
        }

        const token = generateJwtKey(payload);
        return res.status(200).json({token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : "Internal server Error"});
    }
})

router.get('/profile',jwtAuthentication,async (req,res,next)=>{
    try{
        const userProfile = req.user;
        const userId = userProfile.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
        next();
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : "Internal server Error"});
    }
})

router.put('/profile/password',jwtAuthentication,async (req,res,next)=>{
    try{
        const userId = req.user.id;
        const {currentPassword,newPassword} = req.body;
        const user = await User.findById(userId);

        if(!(await User.comparePassword(currentPassword))){
            return res.status(401).json({error : "Invalid current Password"});
        }

        user.password = newPassword;
        await user.save();

        console.log("password upadated");
        res.status(200).json({message : "password changed Successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : "Internal server Error"});
    }
})

module.exports = router;
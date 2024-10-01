const users = require('../models/user.model');
console.log("hi");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const verifyToken = require('../middleware/verifyToken');

const getAllUsers = async (req , res)=>{
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit

const AllUsers = await users.find({} , {"__v" : false  }).limit(limit).skip(skip);
res.json({status:"success" , data : { users : AllUsers}});
}


const register = async (req , res)=>{
    const {firstName , secondName , Email ,password ,role} = req.body;

    const hashedPassword = await bcrypt.hash(password , 8);
    
    const newUser = new users({firstName , secondName, Email ,password : hashedPassword ,role});
    
    const token = await jwt.sign( {Email : newUser.Email , id : newUser._id} , process.env.JWT_SECRET)

    await newUser.save(); 

    const AllUsers = await users.find(); 
    
    res.json({status:"success" , data : { users : AllUsers}});
}


const login = async (req , res)=>{
    const {Email , password} = req.body;
    if(!Email || !password){
    res.json({msg : " fen el data ya 3rs"})
    }

    const emailCheck = await users.findOne({Email : Email});
    const passwordCheck = await bcrypt.compare(password , emailCheck.password);

    if (emailCheck && passwordCheck) {
        const token = await jwt.sign( {Email : users.Email , id : users._id , role : users.role} , process.env.JWT_SECRET)
        
        res.json({msg : "loggedn in ya m3lm" , 
                token : token
        });
    }else{
        res.json({msg : "error"});
    }

}






module.exports = {getAllUsers , register , login};
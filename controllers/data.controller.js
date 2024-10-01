
// const Mydata = require('../data');
const course = require('../models/course.model');
const bcrypt = require('bcryptjs');

const getHomePage = ( req , res )=>{
    res.send("<h1>hello tho the home page</h1>")
}

const getAllData = async (req , res)=>{
    const limit  = req.query.limit;
    const page = req.query.page;

    const skip = (page - 1) * limit;

    const allData =await course.find().limit(limit).skip(skip);
    res.json({status:"success" , data : {courses : allData}});
}


const getSingleCourse = async (req , res )=>{
    const x = req.params.id ;
    const singleData = await course.findById(x);
    res.json({status:"success" , data : {course : singleData}});
}

const addData = async (req , res)=>{
    const newData = new course(req.body)
    await newData.save();
    const allData = await course.find()
    res.json(allData);
}

const deletData = async (req , res)=>{
const x = req.params.id ;
const deleting = await course.deleteOne({_id : x});

const allData = await course.find()

res.json(allData);

}

module.exports ={getHomePage , getSingleCourse , addData , deletData , getAllData}
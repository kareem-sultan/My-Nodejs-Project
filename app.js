const express = require('express');
const app = express();
const course = require('./models/course.model');
const controller = require('./controllers/data.controller');
const controller2 = require('./controllers/user.controller');

const verifyToken = require('./middleware/verifyToken');
const cors = require('cors');

app.use(express.json());
app.use(cors());

require('dotenv').config()
const mongoose = require('mongoose');

const url = process.env.MONGO_URL;
mongoose.connect(url).then(()=>{
    console.log("connected to Database");
})

//courses api
app.get('/api/data' , cors(),controller.getHomePage);
app.get('/api/alldata', cors() , controller.getAllData);
app.get('/api/data/:id' , cors() , controller.getSingleCourse);
app.post('/api/addData' , cors() , controller.addData);
app.delete('/api/deletData/:id' , verifyToken , cors() , controller.deletData);


//users api
app.get('/api/users' , cors() ,controller2.getAllUsers);
app.post('/api/addUser', cors() , controller2.register);
app.post('/api/login' , cors() , controller2.login);



app.all('*' , (req , res)=>{
    res.json({msg : 'the resource isnt available'})
})

app.listen(4000 , ()=>{
    console.log("http://localhost:4000");
})


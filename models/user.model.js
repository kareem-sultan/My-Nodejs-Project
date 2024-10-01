const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true
    },
    secondName : {
        type : String ,
        required : true
    },
    Email : {
        type : String,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    token : {
        type : String
    },
    role : {
        type : String,
        enum : ["USER" , "ADMIN" , "MANAGER"],
        default : "USER"
    }
})

module.exports = mongoose.model('User', userSchema);
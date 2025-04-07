const mongoose=require('mongoose');

// const bcrypt=require('bcrypt');

// Define the person Schema
const userSchema= new mongoose.Schema ({
    name: {
        type: String,
        require: true // means this is mandatory to fill in the document.
    },
    age: {
        type: Number,
        require: true
    },
    email: {
        type: String
    },
    mobile: {
        type: String // For industry specific mobile numbers type is string type because country code
    },
    address: {
        type: String,
        require: true
    },
    aaharCardNumber: {
        type: Number,
        require: true,
        unique: true //means email always unique .
    },
    password: {
        type : String,
        require: true
    },
    role: {
        type: String,
        enum: ['voter','admin'],
        default: 'voter'
    },
    isVoted:{
        type: Boolean,
        default: false
    },
    

});


const user=mongoose.model('user',userSchema);
module.exports = user;
const mongoose=require('mongoose');

const bcrypt=require('bcrypt');

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

userSchema.pre('save', async function(next) {
    const user=this; // fetch all the data in person var

    // Hash the passport only if it has benn modified or if it is new
    if(!user.isModified('password'))
        return next(); // any changes in password means any modified or new password then if condition false.

    try{
        // hash pasword generation
        const salt=await bcrypt.genSalt(10); // 10 is the how many words added in original password. this number is your choice but gave bigger number then hashing algo should be slowdown.
        
        // hash password
        const hashedPassword = await bcrypt.hash(user.password,salt);

        // overide the original password to hashed password
        user.password= hashedPassword;
        next();
    }
    catch(err){
        return next(err);
    }
});

userSchema.methods.comparePassword= async function(candidatePassword){ // this is use in authentication path

    try{
        const isMatch=await bcrypt.compare(candidatePassword,this.password);
        return isMatch;
    }
    catch(err){
        throw err;
    }
}

const user=mongoose.model('user',userSchema);
module.exports = user;
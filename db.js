const mongoose = require('mongoose');
require('dotenv').config();

// define mongodb connection URL // Lecture no 7
const mongoURL= process.env.DB_URL_LOCAL;// this is our local url
// const mongoURL = 'mongodb+srv://parthamaity2004:Partha988@cluster0.euywxdp.mongodb.net/' this is the data which is replace vby dotenv because security perpose.
// const mongoURL=process.env.DB_URL;// this is the name that is define in .env file

// setup connection
mongoose.connect(mongoURL, {
    // useNewUrlParser : true,
    // useUnifiedTopology : true,
})


const db=mongoose.connection;

// add event listner for database connection

db.on('connected', ()=> {
    console.log("connected to mongoDB server");
});

db.on('erorr', (err) =>{
    console.log('Mongodb connection error : ', err);
});

db.on('disconnected', ()=> {
    console.log('disconnected');
});

//Export the database connection
module.exports=db;
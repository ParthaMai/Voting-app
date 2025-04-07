const express = require('express')
const app = express()
// require('dotenv').config();

const bodyParser= require('body-parser');
app.use(bodyParser.json()); // req body


//Import the person files
const userRoutes=require('./routes/userRoute');

//Use the routers
app.use('/user',userRoutes);

const PORT=process.env.PORT || 3000;

app.listen(3000)

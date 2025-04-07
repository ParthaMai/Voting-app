const express = require('express')
const app = express()
const db= require('./db');
require('dotenv').config();

const bodyParser= require('body-parser');
app.use(bodyParser.json()); // req body

//Import the person files
const userRoutes=require('./routes/userRoute');
const candidateRoutes=require('./routes/candidateRoute');

//Use the routers
app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);



const PORT=process.env.PORT || 3000;

app.listen(3000)

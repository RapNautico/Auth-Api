const express = require('express');
const cors = require('cors');
const { dbConection } = require('./db/config');
require ('dotenv').config();

// console.log(process.env);

// Create a new server
const app = express();

// Database connection
dbConection();

// direct all traffic to the index.html file
app.use(express.static('public'));

// CORS
app.use(cors());

// Read the body of the request
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

// listen for requests
app.listen( process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});
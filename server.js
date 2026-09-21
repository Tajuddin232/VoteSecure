require("dotenv").config();

const express = require('express');

const app = express();

const db = require('./db/db');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const UserRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidate');


app.use('/User',UserRoutes);
app.use('/candidate',candidateRoutes);


app.listen(PORT,()=>{
    console.log("Listening on port 3000");
});
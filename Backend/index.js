const express = require('express');
const app = express();
require('dotenv').config();
const cors=require('cors');

app.use(cors());

const PORT = process.env.PORT || 3000;

//DB connection
const dbConnect = require('./src/config/dbconnection');
dbConnect();

//Middleware to parse JSON request body
app.use(express.json());

//Routes
const userRouter = require('./src/routes/route');
app.use('/', userRouter);




//Server start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
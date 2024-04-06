const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.LOCAL_URL

mongoose.connect(mongoURI);
const db = mongoose.connection;

db.on('connected', ()=>{
    console.log("Connected to mongodb Successfully");
})

db.on('disconnected', ()=>{
    console.log("mongodb server is disconnected");
})

db.on('error', (err)=>{
    console.log("connection error in mongodb", err)
})

module.exports = db
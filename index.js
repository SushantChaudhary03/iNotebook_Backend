const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
const port = process.env.PORT

app.get('/', (req, res)=>{
    res.send("hello world");
})

// Middleware to parse JSON bodies
app.use(express.json());

// Import the router file
const authRouter = require('./routes/auth')
const notesRouter = require('./routes/notes')


// use the router
app.use('/api/auth', authRouter)
app.use('/api/notes', notesRouter)

app.listen(port, ()=>{
    console.log(`listning on port ${port}`);
})
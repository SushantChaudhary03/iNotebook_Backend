const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const fetchUser = require('../middleware/fetchuser');

// get all the loggdin user notes
router.get('/fetchallnotes',fetchUser, async(req, res)=>{
    const notes = await Notes.find({user: req.user.id});
    res.json(notes)
})

module.exports = router
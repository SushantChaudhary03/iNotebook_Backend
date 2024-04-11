const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Notes = require('../models/Notes');
const fetchUser = require('../middleware/fetchuser');

// get all the loggdin user notes
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes)

    } catch (err) {
        console.log(err)
        res.status(500).json({ massage: "Internal server error" })
    }
})


// Add a new Note using post method
router.post('/addnote', fetchUser,
    [
        // Validate and sanitize fields using express-validator middleware
        body('title', 'Title must be atlease 3 characters').isLength({ min: 3 }),
        body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
    ], async (req, res) => {
        try {
            const { title, description, tag } = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const note = new Notes({
                title, description, tag, user: req.user.id
            })
            const saveNote = await note.save();
            res.json(saveNote)

        } catch (err) {
            console.log(err)
            res.status(500).json({ massage: "Internal server error" })
        }
    })
module.exports = router
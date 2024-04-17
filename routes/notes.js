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


// Update an existing note
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body

    // Create a new note object
    const newNote = {};
    if (title) newNote.title = title
    if (description) newNote.description = description
    if (tag) newNote.tag = tag

    // Find the note to be updated and update it
    let note = await Notes.findById(req.params.id)
    if (!note) {
        return res.status(404).send("Not Found")
    }
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("not allowed")
    }
    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    res.json({ note })
})

// Delete an existing Note Using Delte routes
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let note = await Notes.findById(req.params.id)
        if (!note) return res.status(404).send("Not Found")

        // Allow delete only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ Success: "Note has been deleted", note: note })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal server error" })
    }
})

module.exports = router
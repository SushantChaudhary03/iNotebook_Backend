const mongoose = require('mongoose')

const notesSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
        unique: true
    },
    tag:{
        type: String,
        default: "General"
    },
    date:{
        type: Date,
        default: Date.now
    }
})


const Notes = mongoose.model('Notes', notesSchema);
module.exports = Notes
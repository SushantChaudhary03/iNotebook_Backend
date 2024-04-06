const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const user = require('./../models/User')


router.post('/', [
    // Validate and sanitize fields using express-validator middleware
    body('username', 'Enter a valid username').isLength({ min: 5 }).trim().escape(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }).trim().escape(),
    body('email', 'Enter a valid email').isEmail().normalizeEmail(),
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    user.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    }).then(user => res.json(user))
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "Email is already registered" })
        })

})

module.exports = router
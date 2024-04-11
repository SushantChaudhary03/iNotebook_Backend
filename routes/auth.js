const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('./../models/User')
const bcrypt = require('bcrypt')
require('dotenv').config();
const jwt = require('jsonwebtoken');
const fetchUsers = require('../middleware/fetchuser')


// JWT secret key
const JWT_SECRET = process.env.JWT_KEY
router.post('/createuser', [
    // Validate and sanitize fields using express-validator middleware
    body('username', 'Enter a valid username').isLength({ min: 3 }).trim().escape(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }).trim().escape(),
    body('email', 'Enter a valid email').isEmail().normalizeEmail(),
], async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)
        // check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email })

        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" })
        }
        user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: secPass,
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const jwtData = jwt.sign(data, JWT_SECRET)
        console.log(jwtData)
        res.send(jwtData)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ massage: "Internal server error" })
    }
})

// Authenticate a user using POST method. No login required
router.post('/login', [
    body('email', "Enter a valid email").isEmail(),
    body('password', "Please enter a correct password").exists(),
], async (req, res) => {

    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body

    try {

        let user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ error: "User not found. Please try with a registered email address." });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(400).json({ error: "Incorrect password. Please try again." });
        }


        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.send(authToken)

    } catch (err) {
        console.log(err)
        res.status(500).json({ massage: "Internal server error" })
    }
})

// Route to get loggedin users details

router.post('/getuser',fetchUsers, async(req, res)=>{
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select('-password')
        res.send(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({ massage: "Internal server error" })
    }
})



module.exports = router
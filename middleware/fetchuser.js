const jwt = require('jsonwebtoken')
require('dotenv').config();

const fetchUsers = (req, res, next) => {
    // get the user from the jwt token and add id to req obj
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a vlid token" })
    }
    try {
        const JWT_SECRET = process.env.JWT_KEY
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        next()
    } catch (err) {
        res.status(401).json({ error: "Please authenticate using a vlid token" })
    }

}


module.exports = fetchUsers;
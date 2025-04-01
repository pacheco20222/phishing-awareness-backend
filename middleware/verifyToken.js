const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // Check if the token is provided
    if (!authHeader || authHeader.startsWith('Bearer')){
        return res.status(401).json({ msg: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the user info to the request object
        next(); // Call the next middleware or route handler
    } catch (err) {
        console.error(err);
        return res.status(401).json({ msg: 'Invalid token' });
    }
};

module.exports = verifyToken;
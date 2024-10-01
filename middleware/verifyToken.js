const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
const authHeader =req.headers["authentication"] || req.headers["authorization"]; // usually 'authorization'

if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
}

const token = authHeader.split(" ")[1];

if (!token) {
    return res.status(401).json({ message: "Token missing" });
}

  // Process token here (e.g., verify using JWT library)
const decodedToken = jwt.verify(token , process.env.JWT_SECRET);

next();
};

module.exports = verifyToken;
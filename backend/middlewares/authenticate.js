// middleware/authenticate.js
//determines whether the user is already logged in

const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Assumes Bearer token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET); // Replace with your secret key
    req.user = decoded; // Add user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).send("Authentication failed: " + error.message);
  }
};

module.exports = authenticate;

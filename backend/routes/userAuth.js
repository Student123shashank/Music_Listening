const jwt = require("jsonwebtoken");


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Authentication token required" });
    }

    jwt.verify(token, process.env.JWT_SECRET || "Shashank@2024", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token expired or invalid. Please sign in again." });
        }
        req.user = user;
        next();
    });
};


const authenticateAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

module.exports = { authenticateToken, authenticateAdmin };

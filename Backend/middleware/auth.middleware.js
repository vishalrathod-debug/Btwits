const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "No token or invalid format",
        });
    }

    const token = header.split(" ")[1];
    console.log("TOKEN:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("DECODED:", decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.log("JWT ERROR:", error.message);
        return res.status(401).json({
            message: "Invalid token",
        });
    }
}
module.exports = {authMiddleware}
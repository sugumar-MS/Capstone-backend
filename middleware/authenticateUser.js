const authenticateUser = (req, res, next) => {
    // Check if `req.user` is populated
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
};

module.exports = authenticateUser;

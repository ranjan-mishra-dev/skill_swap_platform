import jwt from 'jsonwebtoken'

const isAdmin = (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({Success: false, message: "Access denied, admin only!"});
    }
    next();
}

export default isAdmin
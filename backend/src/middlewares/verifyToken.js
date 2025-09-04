import jwt from 'jsonwebtoken';

const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.headers;
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, please login again" });
    }
    
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    
    req.userId = token_decode.id; // ✅ Best practice to send data in req to next function now there it can access using req.useId
    req.role = token_decode.role;
    
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ success: false, message: "Token verification failed" });
  }
};

export default verifyToken;
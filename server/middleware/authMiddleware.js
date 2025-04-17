import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user ID to request object (without password)
      // Note: We're selecting the entire user object here, minus the password hash.
      req.user = await User.findById(decoded.id).select('-passwordHash'); 
      
      if (!req.user) {
        return res.status(401).json({ status: "error", message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ status: "error", message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ status: "error", message: "Not authorized, no token" });
  }
};

export default authMiddleware;
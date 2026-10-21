const jwt = require('jsonwebtoken');

// Reads the "Authorization: Bearer <token>" header, verifies it, and
// attaches { id, role } to req.user so every route below can check who's
// calling and what role they are.
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };

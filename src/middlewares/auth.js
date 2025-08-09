const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

function auth(required = true) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      if (!required) return next();
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      next();
    } catch {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}

module.exports = auth;

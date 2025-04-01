/**
 * Middleware to authenticate requests using a JSON Web Token (JWT).
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.headers - The headers of the HTTP request.
 * @param {string} [req.headers.authorization] - The authorization header containing the Bearer token.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the request-response cycle.
 *
 * @throws {Error} If the token is missing, invalid, or expired, responds with a 401 status and an error message.
 *
 * @returns {void} Adds the decoded user ID to the `req` object as `req.userId` and calls the `next` middleware.
 */

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access dined. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;

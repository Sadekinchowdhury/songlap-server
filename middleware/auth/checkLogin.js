const jwt = require("jsonwebtoken");

const checklogin = (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "UnAuthenticated",
    });
  }
};
module.exports = checklogin;

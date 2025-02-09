const jwt = require("jsonwebtoken");
const Users = require("../../models/Users");
const bcrypt = require("bcryptjs");

const loginControler = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email_or_phone, password } = req.body;

    // Find user by email or mobile
    const user = await Users.findOne({
      $or: [{ email: email_or_phone }, { mobile: email_or_phone }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found!",
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password!",
      });
    }

    // User login details
    const userLoginDetails = {
      userid: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
    };

    // Generate JWT Token
    const token = jwt.sign(userLoginDetails, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LOGIN_EXPIRE,
    });

    // Set HTTP-Only Cookie
    res.cookie(process.env.COOKIE_NAME || "auth_token", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      signed: false,
    });

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
        email: user.email,
        mobile: user.mobile,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = loginControler;

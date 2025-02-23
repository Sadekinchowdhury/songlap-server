const jwt = require("jsonwebtoken");
const Users = require("../../models/Users");
const bcrypt = require("bcryptjs");

const loginControler = async (req, res, next) => {
   try {
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
         mobile: user.mobile,
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
         user,
      });
   } catch (err) {
      res.status(500).json({
         success: false,
         message: "Internal Server Error",
      });
   }
};
const logOutController = async (req, res, next) => {
   try {
      const decoded = req.user;

      if (!decoded) {
         // User is not authenticated, so return an error
         return res.status(401).json({
            message: "User not authenticated",
         });
      }

      // Clear the authentication cookie
      res.clearCookie(process.env.COOKIE_NAME, {
         httpOnly: true,
         secure: false,
         sameSite: "strict",
         path: "/",
      });

      res.status(200).json({
         success: "true",
         message: "Successfully logged out and cleared cookies",
      });
   } catch (err) {
      res.status(500).json({
         message: "Something went wrong during logout",
      });
   }
};

module.exports = { loginControler, logOutController };

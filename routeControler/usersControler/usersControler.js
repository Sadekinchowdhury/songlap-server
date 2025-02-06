const createHttpError = require("http-errors");
const Users = require("../../models/Users");

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const findUser = await Users.find({});
    res.json(findUser);
  } catch (err) {
    next(err);
  }
};

// Get user by ID
const getUsersById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const findUser = await Users.findById(id);
    if (!findUser) {
      return next(createHttpError(404, "User not found"));
    }
    res.json(findUser);
  } catch (err) {
    next(err);
  }
};

const postUsers = async (req, res, next) => {
  let newUser;

  if (req.files && req.files.length > 0) {
    newUser = new Users({
      ...req.body,
      avatar: req.files[0].filename,
    });
  } else {
    newUser = new Users(req.body);
  }
  try {
    const result = await newUser.save();

    // Send a success response
    res.status(200).json({ result, success: true, message: "User created successfully!" });
  } catch (err) {
    next(err);
  }
};

// Update user
const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    // Find the existing user
    const existingUser = await Users.findById(id);
    if (!existingUser) {
      return next(createHttpError(404, "User not found"));
    }

    // Create a new updated object (immutability)
    const updatedData = { ...existingUser.toObject(), ...req.body };

    // Perform the update and return the new version
    const updatedUser = await Users.findByIdAndUpdate(id, updatedData, { new: true });

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  try {
    const userid = req.params.id;
    const user = await Users.deleteOne({ _id: userid });

    if (user.deletedCount === 0) {
      return next(createHttpError(404, "User not found"));
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, postUsers, getUsersById, updateUser, deleteUser };

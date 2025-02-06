const uploader = require("../../utilities/avatarUploader");

const avatarUpload = (req, res, next) => {
  let avatarValue = {
    uploadFilepath: "avatar",
    uploadType: ["image/jpg", "image/jpeg", "image/png"],
    uploadSize: 1000 * 1000 * 5,
    uploadingError: "There have something wrong for uploading image",
  };
  const upload = uploader(avatarValue);
  upload.any()(req, res, (err) => {
    if (!err) {
      console.log("avatar successfully added");
      next();
    } else {
      return res.status(400).json({
        errors: {
          avatar: {
            msg: err.message,
          },
        },
      });
    }
  });
};
module.exports = avatarUpload;

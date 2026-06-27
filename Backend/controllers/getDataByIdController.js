const User = require("../models/user.model");
const mongoose = require("mongoose");

const getDataByIdController = async (req, res) => {
  const id = req.params.id;

  try {
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid ID",
        status: -1,
      });
    }
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: -1,
      });
    }

    res.status(200).json(user);
    
  } catch (err) {
    res.status(400).json({
      message: "Server Error ",
      status: -1,
    });
  }
};
module.exports = { getDataByIdController };

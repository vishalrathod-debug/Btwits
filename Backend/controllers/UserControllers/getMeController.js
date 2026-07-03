const { model } = require("mongoose");
const User = require("../../models/user.model");


const getMeController =async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = getMeController;
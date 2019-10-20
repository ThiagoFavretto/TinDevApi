const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    const { devId } = req.params;
    const { user } = req.headers;

    loogedDev = await Dev.findById(user);
    targetDev = await Dev.findById(devId);

    if (!targetDev) {
      return res
        .status(400)
        .json({ error: "You tried to access a dev that doesn't exist" });
    }

    loogedDev.dislikes.push(targetDev._id);

    await loogedDev.save();

    return res.json(loogedDev);
  }
};

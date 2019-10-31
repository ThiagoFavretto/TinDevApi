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

    if (targetDev.likes.includes(loogedDev._id)) {
      console.log("Match");
      const loogdSocket = req.connectUsers[user];
      const targetSocket = req.connectUsers[devId];

      if (loogdSocket) {
        req.io.to(loogdSocket).emit("match", targetDev);
      }

      if (targetSocket) {
        req.io.to(targetSocket).emit("match", loogedDev);
      }
    }

    loogedDev.likes.push(targetDev._id);

    await loogedDev.save();

    return res.json(loogedDev);
  }
};

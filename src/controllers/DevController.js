const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
  async store(req, res) {
    const { username } = req.body;

    const userRepet = await Dev.findOne({ user: username });

    if (userRepet) {
      return res.json(userRepet);
    }

    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const { name, bio, avatar_url } = response.data;

    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar: avatar_url
    });

    return res.json(dev);
  },

  async index(req, res) {
    const { user } = req.headers;

    const loogedDev = await Dev.findById(user);

    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loogedDev.likes } },
        { _id: { $nin: loogedDev.dislikes } }
      ]
    });

    return res.json(users);
  }
};

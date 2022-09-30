// const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Users } = require("../database/usersSchema");

const googleAuth = async (req, res) => {
  //   console.log(req.user.email);

  const { _id } = req.user;
  const payload = {
    id: _id,
  };
  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" });
  await Users.findByIdAndUpdate(_id, { token });
  res.json({ token });
};
module.exports = { googleAuth };

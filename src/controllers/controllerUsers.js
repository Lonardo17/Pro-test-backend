const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { OAuth2Client } = require("google-auth-library");
const { Users } = require("../database/usersSchema");
require("dotenv").config();
// const uuid = require("uuid");
// const sgMail = require("@sendgrid/mail");

const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});
const loginGoogleUsers = async (req, res, next) => {
  const code = req.body.code;
  const { tokens } = await googleClient.getToken(code);
  const ticket = await googleClient.verifyIdToken({
    idToken: `${tokens.id_token}`,
    audient: `${process.env.GOOGLE_CLIENT_ID}`,
  });
  const { email, picture } = ticket.getPayload();
  console.log(picture);
  let user = await Users.findOne({ email });
  if (!user) {
    user = await Users.create({ email: email });
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET
    );
    user = await Users.findByIdAndUpdate(user._id, { token }, { new: true });
  } else {
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET
    );
    user = await Users.findByIdAndUpdate(user._id, { token }, { new: true });
  }
  const avatarURL =
    "https://th-thumbnailer.cdn-si-edu.com/wVkY4ktA-0JvRsuh8EASm6NoSNs=/1000x750/filters:no_upscale():focal(978x630:979x631)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/db/82/db8234fc-f167-4285-82bd-123d035e32ad/cats.jpg";
  const userAvatar = picture || avatarURL;

  res.status(200).json({
    user: {
      email: user.email,
      avatar: userAvatar,
      token: user.token,
    },
  });
};

const userRegistration = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const costFactor = 6;
    const hashPassword = await bcryptjs.hash(password, costFactor);
    const data = await Users.findOne({ email: email });
    const avatarURL = gravatar.url(email, {
      protocol: "https",
      d: "identicon",
    });
    // const verificationToken = uuid.v4();
    if (data) return res.status(409).json({ message: "Email in use" });
    const newUser = new Users({
      password: hashPassword,
      email,
      token: null,
      avatarURL,
      //   verificationToken,
    });
    await newUser.save();

    res.status(201).json({ user: { email, avatarURL } });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await Users.findOne({ email: email });
    const hashPassword = data.password;
    let isCorrectPassword;

    if (data) {
      isCorrectPassword = await bcryptjs.compare(password, hashPassword);
    }

    if (!data || !isCorrectPassword)
      return res.status(401).json({ message: "Email or password is wrong" });

    if (isCorrectPassword) {
      const payload = { id: data._id };
      const secret = process.env.SECRET;
      const token = jwt.sign(payload, secret, { expiresIn: "1d" });
      await Users.findOneAndUpdate({ email: email }, { token: token });

      res.status(200).json({
        user: {
          email: data.email,
          avatar: data.avatarURL,
          token,
        },
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const userLogout = async (req, res, next) => {
  try {
    await Users.findByIdAndUpdate(req.userId, { token: null });
    res.status(204).json("No Content");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");
    const token = authorizationHeader.replace("Bearer ", "");
    const decode = await jwt.decode(token);
    const user = await Users.findOne({ _id: decode.id });
    res.status(200).json({
      user: {
        email: user.email,
        avatar: user.avatarURL,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  userRegistration,
  userLogin,
  userLogout,
  getCurrentUser,
  loginGoogleUsers,
};

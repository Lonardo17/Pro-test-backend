const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

// const uuid = require("uuid");
// const sgMail = require("@sendgrid/mail");
const { Users } = require("../database/usersSchema");

const userRegistration = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const costFactor = 6;
    const hashPassword = await bcryptjs.hash(password, costFactor);
    const data = await Users.findOne({ email: email });
    const avatarURL = gravatar.url(email);
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

    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // const msg = {
    //   to: email,
    //   from: "pustosmekhov.al@gmail.com",
    //   subject: "Completion of registration",
    //   text: "Follow the link to complete registration: localhost:3000/api/users/verify/:verificationToken",
    //   html: `<p>Follow the link to complete registration: <a>localhost:3000/api/users/verify/:verificationToken</a></p>`,
    // };

    // await sgMail.send(msg);
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

module.exports = { userRegistration, userLogin, userLogout, getCurrentUser };

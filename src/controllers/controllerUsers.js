const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const uuid = require("uuid");
// const sgMail = require("@sendgrid/mail");
const Users = require("../database/usersSchema");

const userRegistration = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const costFactor = 6;
    const hashPassword = await bcryptjs.hash(password, costFactor);
    const data = await Users.findOne({ email: email });
    const avatarURL = gravatar.url(email);
    // const verificationToken = uuid.v4();
    if (data)
      return res.json({
        status: "conflict",
        code: 409,
        message: "Email in use",
      });
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

    res.json({
      status: "Created",
      code: 201,
      user: { email, avatarURL },
    });
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
      return res.json({
        status: "Unauthorized",
        code: 401,
        message: "Email or password is wrong",
      });

    if (isCorrectPassword) {
      const payload = { payload: "payload" };
      const secret = "secret words";
      const token = jwt.sign(payload, secret, { expiresIn: "1d" });
      await Users.findOneAndUpdate({ email: email }, { token: token });
      res.json({
        status: "OK",
        code: 200,
        ResponseBody: {
          token,
          user: {
            email,
            avatarURL,
          },
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
    const token = req.token;
    const decode = jwt.decode(token);
    const userById = Users.findOne({ _id: decode.id });
    if (!userById) {
      return res.json({
        status: "Unauthorized",
        code: 401,
        message: "Not authorized",
      });
    }
    await Users.findByIdAndUpdate({ _id: decode.id }, { token: null });
    res.json({ status: "No Content", code: 204 });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = { userRegistration, userLogin, userLogout };

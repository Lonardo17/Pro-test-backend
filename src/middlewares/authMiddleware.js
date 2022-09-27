const jwt = require("jsonwebtoken");

const { Users } = require("../database/usersSchema");

const authMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  const [tokenType, token] = req.headers.authorization.split(" ");
  if (!token) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  try {
    const decodeJwt = await jwt.decode(token, process.env.SECRET);
    if (!(await Users.findOne({ _id: decodeJwt.id, token: token }))) {
      res.json({
        status: "Unauthorized",
        code: 401,
        message: "Not authorized",
      });
    }
    req.userId = decodeJwt.id;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { authMiddleware };

const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send(`<a href="http://localhost:3000/users/google">google login</a>`);
});
module.exports = router;

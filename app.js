const express = require("express");
const logger = require("morgan");
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');
const cors = require("cors");
const testsRouter = require("./src/routes/api/tests");
const usersRouter = require("./src/routes/api/users");
const authPages = require("./src/routes/pages/auth");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/pages/auth", authPages);
app.use("/test", testsRouter);
app.use("/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;

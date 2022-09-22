const app = require("./app");
const db = require("./src/database/connection");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

db.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running. Use our API on port!`);
  });
}).catch((error) => {
  console.log(`Error: ${error.message}.`);
});

const express = require("express");
const routes = require("./routes");
const middleware = require("./middleware");

const dotenv = require("dotenv").config();
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(middleware.requestLogger);

app.use(middleware.errorHandler);

app.use("/api", routes);

// start the server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;

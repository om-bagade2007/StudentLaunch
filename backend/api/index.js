const serverless = require("serverless-http");
const app = require("../app"); // see step 3

module.exports = serverless(app);

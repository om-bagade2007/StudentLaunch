// Vercel's Node.js runtime accepts Express applications as request handlers.
// Wrapping the app with serverless-http uses a Lambda event/context adapter,
// which is not the request/response contract Vercel invokes here.
module.exports = require("../app");

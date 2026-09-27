// Vercel only discovers functions in the root /api directory; all /api/* requests
// are rewritten here and routed by the Express app.
module.exports = require("../backend/app");

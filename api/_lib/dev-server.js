// Local development server - not used by Vercel
require("dotenv").config();

const app = require("../index");

// Port 5001 is used by default because macOS ControlCenter/AirPlay occupies port 5000
const PORT = process.env.PORT || 5001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Development server running on http://localhost:${PORT}`);
  });
}

module.exports = app;

const express = require("express");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();

const CLIENT_ID = "1508528257711210677";
const CLIENT_SECRET = "dJocn3UJ0hiJIJXrqyfEga8NmV_emjwo";
const REDIRECT_URI = "http://localhost:3000/callback";

app.get("/callback", (req, res) => {
  console.log("Callback hit");
  console.log("QUERY:", req.query);

  res.send("Check terminal");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
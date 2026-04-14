const express = require("express");

const app = express();
app.use(express.json());

app.post("/employees", (req, res) => {
  const { fullName, jobTitle, country, salary } = req.body;

  if (!fullName || !jobTitle || !country || !salary) {
    return res.status(400).json({ error: "Invalid input" });
  }

  res.status(201).json(req.body);
});

module.exports = app;
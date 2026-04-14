const express = require("express");
const prisma = require("./db");


const app = express();
app.use(express.json());

app.post("/employees", async (req, res) => {
  const { fullName, jobTitle, country, salary } = req.body;

  if (!fullName || !jobTitle || !country || !salary) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const employee = await prisma.employee.create({
    data: { fullName, jobTitle, country, salary }
  });

  res.status(201).json(employee);
});

app.get("/employees", async (req, res) => {
  const employees = await prisma.employee.findMany();
  res.json(employees);
});

module.exports = app;
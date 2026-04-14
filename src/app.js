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

app.get("/employees/:id/salary", async (req, res) => {
  const emp = await prisma.employee.findUnique({
    where: { id: Number(req.params.id) }
  });

  let deduction = 0;

  if (emp.country === "India") deduction = 0.1;
  else if (emp.country === "United States") deduction = 0.12;

  const netSalary = emp.salary - emp.salary * deduction;

  res.json({ netSalary });
});

module.exports = app;
const express = require("express");
const prisma = require("./db");
const { calculateSalary } = require("./utils/salary");

const app = express();
app.use(express.json());

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const validateSalary = salary => {
  return salary === undefined || salary === null || typeof salary !== "number" || salary <= 0;
};

app.post(
  "/employees",
  asyncHandler(async (req, res) => {
    const { fullName, jobTitle, country, salary } = req.body;

    if (!fullName || !jobTitle || !country || validateSalary(salary)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const employee = await prisma.employee.create({
      data: { fullName, jobTitle, country, salary }
    });

    res.status(201).json(employee);
  })
);

app.get(
  "/employees",
  asyncHandler(async (req, res) => {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  })
);

app.get(
  "/employees/:id/salary",
  asyncHandler(async (req, res) => {
    const emp = await prisma.employee.findUnique({
      where: { id: Number(req.params.id) }
    });

    if (!emp) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const netSalary = calculateSalary(emp.salary, emp.country);
    res.json({ netSalary });
  })
);

app.put(
  "/employees/:id",
  asyncHandler(async (req, res) => {
    const employeeId = Number(req.params.id);
    const { fullName, jobTitle, country, salary } = req.body;

    const existing = await prisma.employee.findUnique({
      where: { id: employeeId }
    });

    if (!existing) {
      return res.status(404).json({ error: "Employee not found" });
    }

    if (salary !== undefined && validateSalary(salary)) {
      return res.status(400).json({ error: "Invalid salary" });
    }

    const data = {};
    if (fullName) data.fullName = fullName;
    if (jobTitle) data.jobTitle = jobTitle;
    if (country) data.country = country;
    if (salary !== undefined) data.salary = salary;

    if (!Object.keys(data).length) {
      return res.status(400).json({ error: "No valid update fields" });
    }

    const updated = await prisma.employee.update({
      where: { id: employeeId },
      data
    });

    res.json(updated);
  })
);

app.delete(
  "/employees/:id",
  asyncHandler(async (req, res) => {
    const employeeId = Number(req.params.id);

    const existing = await prisma.employee.findUnique({
      where: { id: employeeId }
    });

    if (!existing) {
      return res.status(404).json({ error: "Employee not found" });
    }

    await prisma.employee.delete({
      where: { id: employeeId }
    });

    res.status(204).send();
  })
);

app.get(
  "/metrics/country/:country",
  asyncHandler(async (req, res) => {
    const employees = await prisma.employee.findMany({
      where: { country: req.params.country }
    });

    const salaries = employees.map(e => e.salary);
    const avg = salaries.length ? salaries.reduce((a, b) => a + b, 0) / salaries.length : 0;
    const min = salaries.length ? Math.min(...salaries) : 0;
    const max = salaries.length ? Math.max(...salaries) : 0;

    res.json({ min, max, avg });
  })
);

app.get(
  "/metrics/job-title/:jobTitle",
  asyncHandler(async (req, res) => {
    const employees = await prisma.employee.findMany({
      where: { jobTitle: req.params.jobTitle }
    });

    const salaries = employees.map(e => e.salary);
    const avg = salaries.length ? salaries.reduce((a, b) => a + b, 0) / salaries.length : 0;
    const min = salaries.length ? Math.min(...salaries) : 0;
    const max = salaries.length ? Math.max(...salaries) : 0;

    res.json({ min, max, avg });
  })
);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;

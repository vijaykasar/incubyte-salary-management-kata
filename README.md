# 💼 Incubyte Salary Management API

A production-ready REST API built using **Node.js (JavaScript)** following strict **Test Driven Development (TDD)** principles.

This application manages employee data, calculates salaries based on country-specific rules, and provides salary insights.

---

# 🚀 Tech Stack

- Node.js (JavaScript)
- Express.js
- SQLite (via Prisma ORM)
- Jest (Testing)
- Supertest (API Testing)

---

# 🧠 Approach

This project strictly follows **Test Driven Development (TDD)**:

1. Write a failing test ❌  
2. Implement minimal code to pass ✅  
3. Refactor 🔄  

Each step is committed separately to clearly demonstrate how the code evolved over time.

---

# 📦 Features

## 1. Employee CRUD APIs

- Create employee  
- Get all employees  
- Get employee by ID  
- Update employee  
- Delete employee  

### Employee Fields

- `fullName` (required)  
- `jobTitle` (required)  
- `country` (required)  
- `salary` (required)  

---

## 2. Salary Calculation API

### Endpoint



### Deduction Rules

- India → 10% TDS  
- United States → 12% TDS  
- Other countries → No deduction  

### Example Response

```json
{
  "gross": 100000,
  "deduction": 10000,
  "netSalary": 90000
}
```

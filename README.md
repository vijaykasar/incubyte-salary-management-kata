# 💼 Incubyte Salary Management API

A REST API built with **Node.js** and **Express**, using **Prisma** for database access and **Jest / Supertest** for tests.

The project manages employee records, calculates country-specific salary deductions, and exposes basic salary analytics.

---

# 🚀 Tech Stack

- Node.js
- Express.js
- Prisma ORM
- SQLite (configured via Prisma schema `file:./dev.db`)
- Jest
- Supertest

---

# ✅ Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Generate Prisma client and apply the SQLite schema:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. Start the server:

   ```bash
   node src/server.js
   ```

---

# 🧪 Testing

Run the test suite with:

```bash
npm test
```

---

# 📡 API Endpoints

## Create employee

- Method: `POST`
- Path: `/employees`
- Body:
  - `fullName` (string, required)
  - `jobTitle` (string, required)
  - `country` (string, required)
  - `salary` (number, required)

### Example request

```json
{
  "fullName": "Vijay",
  "jobTitle": "Engineer",
  "country": "India",
  "salary": 100000
}
```

### Success response

- Status: `201`
- Body: created employee object


## List employees

- Method: `GET`
- Path: `/employees`

### Success response

- Status: `200`
- Body: array of employee objects


## Calculate salary

- Method: `GET`
- Path: `/employees/:id/salary`

### Behavior

- Retrieves employee by ID
- Applies country-specific deduction rules
- Returns `netSalary`

### Deduction rules

- `India` → 10% deduction
- `United States` → 12% deduction
- all other countries → 0% deduction

### Example response

```json
{
  "netSalary": 90000
}
```


## Country metrics

- Method: `GET`
- Path: `/metrics/country/:country`

### Success response

- Status: `200`
- Body:
  - `min` — minimum salary for the country
  - `max` — maximum salary for the country
  - `avg` — average salary for the country

---

## Job title metrics

- Method: `GET`
- Path: `/metrics/job-title/:jobTitle`

### Success response

- Status: `200`
- Body:
  - `min` — minimum salary for the job title
  - `max` — maximum salary for the job title
  - `avg` — average salary for the job title

---

## Implementation Details

This project was updated using AI assistance to fix the database configuration, restore failing tests, and implement missing API behavior. Changes include:

- switching Prisma to SQLite with `file:./dev.db`
- adding update and delete employee endpoints
- adding job-title salary metrics
- improving salary validation and missing-entity guards
- adding global error handling for async routes
- updating the test suite to use the correct import path and Prisma client

---

# 📌 Notes

- The current implementation supports employee creation, listing, salary calculation by ID, country salary metrics, job-title metrics, employee updates, and deletes.
- Salary endpoints now guard missing employees and reject invalid salary values.

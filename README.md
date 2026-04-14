# 💼 Incubyte Salary Management API

A REST API built with **Node.js** and **Express**, using **Prisma** for database access and **Jest / Supertest** for tests.

The project manages employee records, calculates country-specific salary deductions, and exposes basic salary analytics.

---

# 🚀 Tech Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL (configured via `DATABASE_URL`)
- Jest
- Supertest

---

# ✅ Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure your database URL:

   ```bash
   setx DATABASE_URL "postgresql://user:password@localhost:5432/database"
   ```

3. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

4. Start the server:

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

# 📌 Notes

- The current implementation supports employee creation, listing, salary calculation by ID, and country salary metrics.
- Update / delete employee endpoints are not implemented in the current codebase.

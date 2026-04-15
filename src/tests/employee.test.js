const request = require("supertest");
const app = require("../app");
const prisma = require("../db");

describe("Employee API", () => {
  beforeEach(async () => {
    await prisma.employee.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create employee", async () => {
    const res = await request(app).post("/employees").send({
      fullName: "Vijay",
      jobTitle: "Engineer",
      country: "India",
      salary: 100000
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should fail if missing fields", async () => {
    const res = await request(app).post("/employees").send({});
    expect(res.status).toBe(400);
  });

  it("should reject salary of zero or negative values", async () => {
    const res = await request(app).post("/employees").send({
      fullName: "Vijay",
      jobTitle: "Engineer",
      country: "India",
      salary: 0
    });

    expect(res.status).toBe(400);
  });

  it("should fetch employees", async () => {
    await prisma.employee.create({
      data: {
        fullName: "Vijay",
        jobTitle: "Engineer",
        country: "India",
        salary: 100000
      }
    });

    const res = await request(app).get("/employees");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it("should calculate salary for India", async () => {
    const emp = await prisma.employee.create({
      data: {
        fullName: "A",
        jobTitle: "Dev",
        country: "India",
        salary: 100000
      }
    });

    const res = await request(app).get(`/employees/${emp.id}/salary`);
    expect(res.status).toBe(200);
    expect(res.body.netSalary).toBe(90000);
  });

  it("should return 404 for missing employee salary", async () => {
    const res = await request(app).get("/employees/999/salary");
    expect(res.status).toBe(404);
  });

  it("should return country metrics", async () => {
    await prisma.employee.createMany({
      data: [
        { fullName: "A", jobTitle: "Dev", country: "India", salary: 100000 },
        { fullName: "B", jobTitle: "Dev", country: "India", salary: 120000 }
      ]
    });

    const res = await request(app).get("/metrics/country/India");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ min: 100000, max: 120000, avg: 110000 });
  });

  it("should return job title metrics", async () => {
    await prisma.employee.createMany({
      data: [
        { fullName: "A", jobTitle: "Engineer", country: "India", salary: 100000 },
        { fullName: "B", jobTitle: "Engineer", country: "United States", salary: 120000 }
      ]
    });

    const res = await request(app).get("/metrics/job-title/Engineer");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ min: 100000, max: 120000, avg: 110000 });
  });

  it("should return zero metrics when no job title exists", async () => {
    const res = await request(app).get("/metrics/job-title/Nonexistent");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ min: 0, max: 0, avg: 0 });
  });

  it("should update an employee", async () => {
    const emp = await prisma.employee.create({
      data: {
        fullName: "A",
        jobTitle: "Dev",
        country: "India",
        salary: 100000
      }
    });

    const res = await request(app)
      .put(`/employees/${emp.id}`)
      .send({ salary: 110000, country: "United States" });

    expect(res.status).toBe(200);
    expect(res.body.salary).toBe(110000);
    expect(res.body.country).toBe("United States");
  });

  it("should delete an employee", async () => {
    const emp = await prisma.employee.create({
      data: {
        fullName: "A",
        jobTitle: "Dev",
        country: "India",
        salary: 100000
      }
    });

    const res = await request(app).delete(`/employees/${emp.id}`);
    expect(res.status).toBe(204);
  });
});

const request = require("supertest");
const app = require("../src/app");

describe("POST /employees", () => {
  it("should create employee", async () => {
    const res = await request(app).post("/employees").send({
      fullName: "Vijay",
      jobTitle: "Engineer",
      country: "India",
      salary: 100000
    });

    expect(res.status).toBe(201);
  });
});
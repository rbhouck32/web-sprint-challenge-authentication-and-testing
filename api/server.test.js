const request = require("supertest"); // calling it "request" is a common practice
const db = require("../data/dbConfig");
const server = require("./server.js");

test("sanity", () => {
  expect(3).toEqual(3);
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db("users").truncate();
});
afterAll(async () => {
  await db.destroy();
});

const rob = { username: "RobH", password: "tootles" };
const sean = { username: "SeanT", password: "meow" };

describe("[POST] /api/auth/register", () => {
  it("responds with the newly registered user", async () => {
    let res;
    res = await request(server).post("/api/auth/register").send(rob);
    expect(res.body).toMatchObject({ id: 1, ...rob });

    res = await request(server).post("/api/auth/register").send(sean);
    expect(res.body).toMatchObject({ id: 2, ...sean });
  });
});

describe("[GET] /api/users", () => {
  it("should return an OK status code from the index route", async () => {
    const expectedStatusCode = 200;

    const response = await request(server).get("/api/users");

    expect(response.status).toEqual(expectedStatusCode);
  });

  it("should return a JSON object from the index route", async () => {
    const expectedBody = {
      id: 1,
      username: "Batman",
      password: "$2a$09$RJfIwnTolHAqcD6.lSSQoeUYtMw0TRsZcYUC9N7qmgesgbaGLnSly",
    };

    const response = await request(server).get("/api/users");

    expect(response.body).toEqual(expectedBody);
  });
});

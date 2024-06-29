const request = require("supertest");
const app = require("../../app");

describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    await request(app)
      .get("/launches")
      .expect(200)
      .expect("Content-Type", /json/);
  });
});

describe("Test POST /launch", () => {
  const completeRequestData = {
    mission: "ZTM155",
    rocket: "ZTM Experimental IS1",
    target: "Kepler-186 f",
    launchDate: "January 17, 2030",
  };

  const requestDateWithoutLaunchDate = {
    mission: "ZTM155",
    rocket: "ZTM Experimental IS1",
    target: "Kepler-186 f",
  };

  const requestDataWithInvalidDate = {
    mission: "ZTM155",
    rocket: "ZTM Experimental IS1",
    target: "Kepler-186 f",
    launchDate: "invalidDate",
  };

  test("It should respond with 201 success", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeRequestData)
      .expect(201)
      .expect("Content-Type", /json/);

    const requestDate = new Date(completeRequestData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(responseDate).toBe(requestDate);
    expect(response.body).toMatchObject(requestDateWithoutLaunchDate);
  });

  test("It should catch missing required properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(requestDateWithoutLaunchDate)
      .expect(400)
      .expect("Content-Type", /json/);

    expect(response.body).toStrictEqual({
      error: "Missing required launch property",
    });
  });

  test("It should catch invalid dates", async () => {
    const response = await request(app)
      .post("/launches")
      .send(requestDataWithInvalidDate)
      .expect(400)
      .expect("Content-Type", /json/);

    expect(response.body).toStrictEqual({
      error: "Invalid launch date",
    });
  });
});

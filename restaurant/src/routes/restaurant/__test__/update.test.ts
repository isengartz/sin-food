import request from "supertest";
import { app } from "../../../app";
import {
  API_ROOT_ENDPOINT,
  RESTAURANT_CREATE_VALID_PAYLOAD,
} from "../../../utils/constants";
import { Restaurant } from "../../../models/restaurant";

it("should return 401 when user isnt logged in", async () => {
  await request(app)
    .put(`${API_ROOT_ENDPOINT}/restaurants/randomid`)
    .send({ name: "New Name" })
    .expect(401);
});
it("should return swap the id to restaurants id when user is not admin", async () => {
  const updatedPayload = {
    ...RESTAURANT_CREATE_VALID_PAYLOAD,
    name: "NEW NAME",
  };

  // Create new User
  const { user, cookie } = await global.signin();

  // send the payload using the 2nd users
  await request(app)
    .put(`${API_ROOT_ENDPOINT}/restaurants/asdasd`)
    .set("Cookie", cookie)
    .send(updatedPayload)
    .expect(200);

  // Expect the update to be a success as the id should swap to current user
  const updatedUser = await Restaurant.findById(user.id);
  expect(updatedUser!.name).toEqual("NEW NAME");
});

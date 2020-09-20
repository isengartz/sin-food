import express, { Request, Response } from "express";
import { User } from "../models/user";
import { Helper } from "../utils/helper";
import { BadRequestError, Password } from "@sin-nombre/sinfood-common";

const router = express.Router();

router.post("/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  // Check if user exists
  if (!user) {
    throw new BadRequestError("Email or password combination is wrong");
  }
  // Check if password is valid
  const passwordsMatch = await Password.compare(user.password!, password);
  if (!passwordsMatch) {
    throw new BadRequestError("Email or password combination is wrong");
  }
  // Store JWT in session
  req.session = Helper.serializeToken(
    Helper.signToken({
      id: user.id,
      email: user.email,
    })
  );

  res.status(200).send(user);
});

export { router as signinRouter };

import express, { Request, Response, NextFunction } from "express";
import { BadRequestError } from "@sin-nombre/sinfood-common";
import { User } from "../models/user";
import { Helper } from "../utils/helper";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const {
    email,
    password,
    first_name,
    last_name,
    phone,
    password_confirm,
  } = req.body;
  if (!password_confirm || password_confirm !== password) {
    throw new BadRequestError(
      `Password & Password Confirmation must be identical`
    );
  }
  const user = User.build({
    email,
    password,
    first_name,
    last_name,
    phone,
  });
  await user.save();

  // Add JWT to session
  req.session = Helper.serializeToken(
    Helper.signToken({ id: user.id, email: user.email })
  );
  res.status(200).send(user);
});
export { router as createUserRouter };

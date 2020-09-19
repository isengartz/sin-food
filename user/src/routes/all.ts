import express, { Request, Response, NextFunction } from "express";
import { User } from "../models/user";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const users = await User.find({});
  res.status(200).send({ data: users });
});
export { router as AllUserRouter };

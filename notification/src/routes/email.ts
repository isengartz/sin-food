import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.post("/send-email", function (
  req: Request,
  res: Response,
  next: NextFunction
) {});

export { router as sendEmailRouter };

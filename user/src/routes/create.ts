import express, { Request, Response, NextFunction } from "express";
import {User} from "../models/user";

const router = express.Router();

router.post(
    "/",
    async (req: Request, res: Response, next: NextFunction) => {
        const {email,password,first_name,last_name,addresses,phone} = req.body;
        const user = await User.create(req.body);
        res.status(200).send(user);
    }
);
export { router as CreateUserRouter };

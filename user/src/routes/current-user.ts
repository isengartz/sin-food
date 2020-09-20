import express from "express";
import { currentUser } from "@sin-nombre/sinfood-common";

const router = express.Router();

router.get("/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };

import express from "express";
import { listGames, createGames } from "../controllers/games.controllers.js";
import validateGames from "../middlewares/games.middlewares.js";

const router = express.Router();

router.get("/", listGames);
router.post("/", validateGames, createGames);

export default router;

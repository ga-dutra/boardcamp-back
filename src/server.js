import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import categoriesRouter from "./routes/categories.router.js";
import gamesRouter from "./routes/games.router.js";
import customersRouter from "./routes/customers.router.js";
import rentalsRouter from "./routes/rentals.router.js";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/categories", categoriesRouter);
app.use("/games", gamesRouter);
app.use("/customers", customersRouter);
app.use("/rentals", rentalsRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});

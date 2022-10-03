import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import categoriesRouter from "./routes/categories.router.js";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/categories", categoriesRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});

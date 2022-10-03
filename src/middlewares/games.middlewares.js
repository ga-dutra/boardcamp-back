import connection from "../database/database.js";
import gameSchema from "../models/games.schemas.js";

async function validateGames(req, res, next) {
  const game = req.body;

  const gameValidation = gameSchema.validate(game, { abortEarly: false });

  if (gameValidation.error) {
    const errors = gameValidation.error.details.map(
      (details) => details.message
    );
    res.status(400).send(errors);
  }

  try {
    // checks if category already exists
    const categories = await connection.query(
      "SELECT * FROM categories WHERE id = $1",
      [game.categoryId]
    );
    if (categories.rowCount === 0) {
      return res.status(400).send({ error: "Category does not exist!" });
    }

    // checks if game already exists
    const games = await connection.query(
      "SELECT * FROM games WHERE name = $1",
      [game.name]
    );
    if (games.rowCount !== 0) {
      return res.status(409).send({ error: "Game name already in use!" });
    }
    next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export default validateGames;

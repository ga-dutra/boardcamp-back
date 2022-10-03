import connection from "../database/database.js";

async function listGames(req, res) {
  const { name } = req.query;
  let filter = "";

  if (name) {
    filter = `WHERE LOWER (games.name) LIKE LOWER ('${name}%')`;
  }

  try {
    const gamesQuery = await connection.query(
      `SELECT games.*, categories.name as "categoryName" FROM GAMES JOIN categories ON games."categoryId" = categories.id ${
        filter !== "" ? filter : ""
      };`
    );
    return res.status(200).send(gamesQuery.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function createGames(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  try {
    await connection.query(
      'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)',
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    return res.status(201).send({ message: "Game created!" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { listGames, createGames };

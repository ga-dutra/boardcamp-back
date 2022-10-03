import connection from "../database/database.js";

async function listCategories(req, res) {
  try {
    const categoriesQuery = await connection.query(`SELECT * from categories`);
    res.status(200).send(categoriesQuery.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function createCategories(req, res) {
  const categoryName = req.body.name;

  try {
    await connection.query("INSERT INTO categories (name) VALUES ($1)", [
      categoryName,
    ]);
    res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { listCategories, createCategories };

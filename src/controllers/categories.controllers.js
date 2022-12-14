import connection from "../database/database.js";

async function listCategories(req, res) {
  const { order, desc, limit, offset } = req.query;

  let filters = "";
  let filterParams = [];
  let filterQtd = 0;

  if (order) {
    filters += `ORDER BY "${order}" ${desc ? "DESC " : ""}`;
  }

  if (limit) {
    filterQtd++;
    filters += `LIMIT $${filterQtd} `;
    filterParams.push(limit);
  }

  if (offset) {
    filterQtd++;
    filters += `OFFSET $${filterQtd}`;
    filterParams.push(offset);
  }

  try {
    const categoriesQuery = await connection.query(
      `SELECT * from categories ${filters};`,
      filterParams
    );
    return res.status(200).send(categoriesQuery.rows);
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
    return res.status(201).send({ message: "Category created!" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { listCategories, createCategories };

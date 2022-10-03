import connection from "../database/database.js";
import categorySchema from "../models/categories.schemas.js";

async function validateCategories(req, res, next) {
  const category = req.body;

  const categoryValidation = categorySchema.validate(category, {
    abortEarly: false,
  });

  if (categoryValidation.error) {
    const errors = categoryValidation.error.details.map(
      (details) => details.message
    );
    res.status(400).send(errors);
  }

  try {
    const categories = await connection.query(
      "SELECT name FROM categories WHERE name = $1",
      [category.name]
    );

    if (categories.rowCount !== 0) {
      return res.status(409).send({ error: "Category name already in use!" });
    }
    next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export default validateCategories;

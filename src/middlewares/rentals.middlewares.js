import connection from "../database/database.js";
import rentalSchema from "../models/rentals.schemas.js";

async function validateNewRental(req, res, next) {
  const newRental = req.body;

  const rentalValidation = rentalSchema.validate(newRental, {
    abortEarly: false,
  });

  if (rentalValidation.error) {
    const errors = rentalValidation.error.details.map(
      (details) => details.message
    );
    return res.status(400).send(errors);
  }

  try {
    const customer = await connection.query(
      `SELECT * FROM customers WHERE id = $1`,
      [newRental.customerId]
    );

    if (customer.rowCount === 0) {
      return res.status(400).send({ error: "Customer not found!" });
    }

    const game = await connection.query("SELECT * FROM games WHERE id = $1", [
      newRental.gameId,
    ]);

    if (game.rowCount === 0) {
      return res.status(400).send({ error: "Game not found!" });
    }

    res.locals.pricePerDay = game.rows[0].pricePerDay;
    next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function validateClosingRental(req, res, next) {
  const id = req.params.id;

  try {
    const rental = await connection.query(
      `SELECT * FROM rentals WHERE id = $1`,
      [id]
    );

    if (rental.rowCount === 0) {
      return res.status(404).send({ error: "Rental Id does not exist!" });
    }

    if (rental.rows[0].returnDate !== null) {
      return res.status(400).send({ error: "Rental is already returned!" });
    }

    const games = await connection.query(`SELECT * FROM games WHERE id = $1`, [
      rental.rows[0].gameId,
    ]);

    res.locals.rentDate = rental.rows[0].rentDate;
    res.locals.daysRented = rental.rows[0].daysRented;
    res.locals.pricePerDay = games.rows[0].pricePerDay;

    next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { validateNewRental, validateClosingRental };

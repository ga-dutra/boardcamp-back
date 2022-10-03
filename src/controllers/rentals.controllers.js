import connection from "../database/database.js";
import dayjs from "dayjs";

async function listRentals(req, res) {
  const { customerId, gameId } = req.query;

  let filters = "";
  let filterParams = [];
  let filterQtd = 0;

  if (customerId) {
    filterQtd++;
    filters += `WHERE "customerId" = $${filterQtd} `;
    filterParams.push(customerId);
  }

  if (gameId) {
    filterQtd++;
    filters += `${
      filterParams.length === 0 ? "WHERE" : "AND"
    } "gameId" = $${filterQtd} `;
    filterParams.push(gameId);
  }

  try {
    const rentals = await connection.query(
      `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) AS customer, json_build_object('id', games.id, 'name', games.name, 'categoryName', games.\"categoryId\", 'categoryId', categories.name) AS game FROM rentals
          JOIN customers ON customers.id = \"customerId\"
          JOIN games ON games.id = \"gameId\"
          JOIN categories ON \"categoryId\" = categories.id ${filters}`,
      filterParams
    );
    return res.status(200).send(rentals.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function createRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  const { pricePerDay } = res.locals;

  const rentDate = dayjs().format("YYYY-MM-DD");
  const originalPrice = daysRented * pricePerDay;
  const returnDate = null;
  const delayFee = null;

  try {
    await connection.query(
      'INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
      ]
    );

    return res.status(201).send({ message: "Rental Created!" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function closeRental(req, res) {
  const id = req.params.id;
  const { rentDate, daysRented, pricePerDay } = res.locals;

  const returnDate = dayjs().format("YYYY-MM-DD");
  const daysLate = dayjs().diff(rentDate, "day");
  const delayFee = daysLate > daysRented ? daysLate * pricePerDay : 0;

  try {
    await connection.query(
      'UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3',
      [returnDate, delayFee, id]
    );
    res.status(200).send({ message: "Rental successfully returned" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    const rental = await connection.query(
      `SELECT * FROM rentals WHERE id = $1`,
      [id]
    );

    if (rental.rowCount === 0) {
      return res.status(404).send({ error: "Rental Id does not exist!" });
    }

    if (rental.rows[0].returnDate === null) {
      return res.status(400).send({ error: "Rental is not returned yet!" });
    }

    await connection.query(`DELETE FROM rentals WHERE id = $1`, [id]);
    return res.status(200).send({ message: "Rental successfully deleted" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { listRentals, createRental, closeRental, deleteRental };

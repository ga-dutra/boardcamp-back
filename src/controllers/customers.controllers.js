import connection from "../database/database.js";

async function listCustomers(req, res) {
  const { cpf } = req.query;
  let filter = "";

  if (cpf) {
    filter = `WHERE cpf LIKE ('${cpf}%')`;
  }

  try {
    const customers = await connection.query(`
      SELECT * FROM customers ${filter !== "" ? filter : ""};`);
    return res.status(200).send(customers.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function listCustomersById(req, res) {
  const customerId = req.params.id;

  try {
    const existingCustomer = await connection.query(
      `SELECT * FROM customers WHERE id = $1`,
      [customerId]
    );

    if (existingCustomer.rowCount === 0) {
      return res.status(404).send({ error: "Customer not found!" });
    }
    return res.status(200).send(existingCustomer.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function createCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    await connection.query(
      "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)",
      [name, phone, cpf, birthday]
    );
    return res.status(201).send({ message: "Customer created!" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function updateCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  const customerId = req.params.id;
  try {
    await connection.query(
      "UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5",
      [name, phone, cpf, birthday, customerId]
    );
    return res.status(201).send({ message: "Customer updated!" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { listCustomers, listCustomersById, createCustomer, updateCustomer };

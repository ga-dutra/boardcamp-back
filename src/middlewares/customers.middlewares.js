import connection from "../database/database.js";
import customerSchema from "../models/customers.schemas.js";

async function validateCustomer(req, res, next) {
  const { cpf } = req.body;
  const customerId = req.params.id;
  const newCustomer = req.body;

  const customerValidation = customerSchema.validate(newCustomer, {
    abortEarly: false,
  });

  if (customerValidation.error) {
    const errors = customerValidation.error.details.map(
      (details) => details.message
    );
    return res.status(400).send(errors);
  }

  try {
    const existingCustomer = await connection.query(
      "SELECT * FROM customers WHERE cpf = $1",
      [cpf]
    );

    if (existingCustomer.rowCount !== 0 && !customerId) {
      return res.status(400).send({ error: "Customer already exists!" });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }

  next();
}

export default validateCustomer;

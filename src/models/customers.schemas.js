import joi from "joi";
import dayjs from "dayjs";

// Validating birthday: Customer must be between 12 and 100 years old
const currentDate = dayjs();
const maxDate = new Date(currentDate - 1000 * 60 * 60 * 24 * 365 * 12);
const minDate = new Date(currentDate - 1000 * 60 * 60 * 24 * 365 * 100);

const customerSchema = joi.object({
  name: joi.string().required(),
  phone: joi
    .string()
    .min(10)
    .max(11)
    .pattern(/^[0-9]*$/)
    .required(),
  cpf: joi
    .string()
    .length(11)
    .pattern(/^[0-9]*$/)
    .required(),
  birthday: joi.date().max(maxDate).min(minDate).required(),
});

export default customerSchema;

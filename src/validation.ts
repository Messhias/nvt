import Joi from 'joi';

// Validation for sale event
export const saleEventSchema = Joi.object({
  eventType: Joi.string().valid('SALES').required(),
  date: Joi.string().isoDate().required(),
  invoiceId: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      itemId: Joi.string().required(),
      cost: Joi.number().integer().positive().required(),
      taxRate: Joi.number().min(0).max(1).required()
    })
  ).min(1).required(),
});

// Validation for tax payment event
export const taxPaymentEventSchema = Joi.object({
  eventType: Joi.string().valid('TAX_PAYMENT').required(),
  date: Joi.string().isoDate().required(),
  amount: Joi.number().integer().positive().required(),
});

// Validation for tax position query
export const taxPositionQuerySchema = Joi.object({
  date: Joi.string().isoDate().required(),
});

// Validation for sale amendment
export const saleAmendmentSchema = Joi.object({
  date: Joi.string().isoDate().required(),
  invoiceId: Joi.string().required(),
  itemId: Joi.string().required(),
  cost: Joi.number().integer().positive().required(),
  taxRate: Joi.number().min(0).max(1).required(),
});

import { Request, Response } from 'express';
import { connectDB } from '../database/connection';
import { saleEventSchema, taxPaymentEventSchema } from '../validation';

export const ingestTransaction = async (req: Request, res: Response): Promise<void> => {
  const db = await connectDB();
  const { eventType, date, invoiceId, items, amount } = req.body;

  // Choose the correct schema based on eventType
  const schema = eventType === 'SALES' ? saleEventSchema : taxPaymentEventSchema;
  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400).json({ errors: error.details });
    return;
  }

  try {
    if (eventType === 'SALES') {
      for (const item of items) {
        await db.run(
          `INSERT INTO sales (event_type, date, invoice_id, item_id, cost, tax_rate) VALUES (?, ?, ?, ?, ?, ?)`,
          [eventType, date, invoiceId, item.itemId, item.cost, item.taxRate]
        );
      }
    } else if (eventType === 'TAX_PAYMENT') {
      await db.run(
        `INSERT INTO tax_payments (event_type, date, amount) VALUES (?, ?, ?)`,
        [eventType, date, amount]
      );
    } else {
      res.status(400).json({ error: 'Invalid event type' });
      return;
    }

    res.status(202).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to ingest transaction' });
  }
};

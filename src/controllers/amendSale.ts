import { Request, Response } from 'express';
import { connectDB } from '../database/connection';
import { saleAmendmentSchema } from '../validation';

export const amendSale = async (req: Request, res: Response) => {
  const db = await connectDB();
  const { date, invoiceId, itemId, cost, taxRate } = req.body;
  const { error } = saleAmendmentSchema.validate(req.body);

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }


  try {
    const result = await db.run(
      `UPDATE sales SET cost = ?, tax_rate = ? WHERE date = ? AND invoice_id = ? AND item_id = ?`,
      [cost, taxRate, date, invoiceId, itemId]
    );
    if (result.changes === 0) {
      await db.run(
        `INSERT INTO sales (event_type, date, invoice_id, item_id, cost, tax_rate) VALUES (?, ?, ?, ?, ?, ?)`,
        ['SALES', date, invoiceId, itemId, cost, taxRate]
      );
    }

    res.status(202).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to amend sale' });
  }
};

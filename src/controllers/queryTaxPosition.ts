import { Request, Response } from 'express';
import { connectDB } from '../database/connection';
import { taxPositionQuerySchema } from '../validation';

export const queryTaxPosition = async (req: Request, res: Response): Promise<void> => {
  const db = await connectDB();
  const { date } = req.query;
  const { error } = taxPositionQuerySchema.validate(req.query);

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  
  try {
    // Calculate the total sales tax until the given date
    const salesTaxResult = await db.get(
      `SELECT SUM(cost * tax_rate) as totalSalesTax FROM sales WHERE date <= ?`,
      [date]
    );

    // Calculate the total tax payments until the given date
    const taxPaymentResult = await db.get(
      `SELECT SUM(amount) as totalTaxPaid FROM tax_payments WHERE date <= ?`,
      [date]
    );

    const totalSalesTax = salesTaxResult?.totalSalesTax || 0;
    const totalTaxPaid = taxPaymentResult?.totalTaxPaid || 0;
    const taxPosition = totalSalesTax - totalTaxPaid;

    res.status(200).json({ date, taxPosition });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to calculate tax position' });
  }
};

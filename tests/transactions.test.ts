import request from 'supertest';
import {app} from '../src/index';
import { connectDB } from '../src/database/connection';
import { Server } from 'http';

let db: any;

beforeEach(async () => {
  await db.exec('DELETE FROM sales');
  await db.exec('DELETE FROM tax_payments');
});


let server: Server;

beforeAll(async () => {
  db = await connectDB();
  server = app.listen(3001, () => console.log('Test server running on port 3001'));
});

afterAll(async () => {
  await db.close();
  server.close();
});


describe('GET /tax-position', () => {
    it('Should return the correct tax position for a date with transactions', async () => {
      // First, insert a sales transaction and a tax payment
      await request(app)
        .post('/api/transactions')
        .send({
          eventType: 'SALES',
          date: '2024-02-22T17:29:39Z',
          invoiceId: 'invoice123',
          items: [
            {
              itemId: 'item123',
              cost: 1000, // 10.00
              taxRate: 0.2, // 20%
            },
          ],
        });
  
      await request(app)
        .post('/api/transactions')
        .send({
          eventType: 'TAX_PAYMENT',
          date: '2024-02-22T17:59:39Z',
          amount: 150, // 1.50
        });
  
      // Now, query the tax position to ensure it is correct
      const response = await request(app)
        .get('/api/tax-position')
        .query({ date: '2024-02-22T18:00:00Z' }); // A date after the transactions
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('taxPosition', 50); // 2.00 - 1.50 = 0.50
    });
  
    it('Should return a tax position of 0 for a date with no transactions', async () => {
      const response = await request(app)
        .get('/api/tax-position')
        .query({ date: '2023-01-01T00:00:00Z' }); // Date with no transactions
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('taxPosition', 0); // No transactions, position should be 0
    });
  
    it('Should return the correct tax position for a past date', async () => {
      // Insert a sales transaction with a specific date
      await request(app)
        .post('/api/transactions')
        .send({
          eventType: 'SALES',
          date: '2024-01-01T12:00:00Z',
          invoiceId: 'invoiceOld',
          items: [
            {
              itemId: 'itemOld',
              cost: 2000, // 20.00
              taxRate: 0.1, // 10%
            },
          ],
        });
  
      // Query a date before this sale
      const response = await request(app)
        .get('/api/tax-position')
        .query({ date: '2024-01-01T10:00:00Z' }); // Before the sale
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('taxPosition', 0); // No sale yet, position should be 0
    });
  
    it('Should return the correct tax position for a future date', async () => {
      // Insert a sales transaction
      await request(app)
        .post('/api/transactions')
        .send({
          eventType: 'SALES',
          date: '2024-01-01T12:00:00Z',
          invoiceId: 'invoiceFuture',
          items: [
            {
              itemId: 'itemFuture',
              cost: 3000, // 30.00
              taxRate: 0.15, // 15%
            },
          ],
        });
  
      // Query a future date
      const response = await request(app)
        .get('/api/tax-position')
        .query({ date: '2025-01-01T12:00:00Z' }); // Future date
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('taxPosition', 450); // Accumulated tax in the future
    });
});  
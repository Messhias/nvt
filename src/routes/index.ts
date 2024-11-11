import { Router } from 'express';
import { ingestTransaction } from '../controllers/ingestTransaction';
import { queryTaxPosition } from '../controllers/queryTaxPosition';
import { amendSale } from '../controllers/amendSale';


const router = Router();

router.post('/transactions', ingestTransaction);

router.get('/tax-position', queryTaxPosition);

router.patch('/sale', amendSale);

export default router;

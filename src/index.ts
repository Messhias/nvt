import express from 'express';
import {runMigrations} from './migrations';
import routes from './routes';

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);

runMigrations().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

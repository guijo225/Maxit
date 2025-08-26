import express from 'express';
import cors from 'cors';
import panierRoutes from './routes/panierRoute.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use('/panier', panierRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API panier');
});

app.listen(port, () => {
  console.log(`Serveur API en cours d'exécution sur http://localhost:${port}`);
});

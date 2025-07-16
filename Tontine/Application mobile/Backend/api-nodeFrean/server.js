import routeTontine from './route.js'
import express from 'express'
import cors from 'cors'

const app = express();
const port = 3000;
app.use(express.json())
app.use(
  cors({
    origin: "*",
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    credentials: true,
  })
);

app.use('/first',routeTontine)


app.listen(port,'0.0.0.0', () => {
  console.log(`Serveur lancé sur http://0.0.0.0:${port}/first`);
});

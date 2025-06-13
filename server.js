const express = require('express');
const app = express();
const adminRoutes = require('./routes/authRoutes');
const tontineRoutes = require('./routes/tontineRoutes');
const utilisateursRoutes = require('./routes/utilisateursRoutes');

app.use(express.json());
app.use('/admin', adminRoutes);
app.use('/tontine', tontineRoutes);
app.use('/tontine', utilisateursRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
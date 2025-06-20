const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    credentials: true,
  })
);

const participantRoute = require("./routes/participant.js");
app.use("/api/participant", participantRoute);

const tontineRoute = require("./routes/tontine.js");
app.use("/api/tontine", tontineRoute);

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});

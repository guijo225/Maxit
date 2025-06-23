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

//route pour les participants
const participantRoute = require("./routes/participant.js");
app.use("/api/participant", participantRoute);

//routes pour la tontine
const tontineRoute = require("./routes/tontine.js");
app.use("/api/tontine", tontineRoute);

//route pous les notifications
const notifRoute = require("./routes/notification.js");
app.use("/api/notification", notifRoute);

app.listen(port, "0.0.0.0", () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});

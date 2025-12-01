import express from "express";
import router from "./routes/index.js";
import db from "./config/db.js";

const app = express();
const port = process.env.PORT || 3000;

db.authenticate()
  .then(() => console.log("Conectado a la base de datos"))
  .catch(err => console.error(err))

app.set("view engine", "pug")

app.use('/', router);

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Aplicación escuchando en el puerto: ´ ${port}`);
});

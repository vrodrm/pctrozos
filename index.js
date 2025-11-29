import express from "express";
import router from "./routes/index.js";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "pug")

app.use('/', router);

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Aplicación escuchando en el puerto: ´ ${port}`);
});

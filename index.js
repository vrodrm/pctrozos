import express from "express";
import router from "./routes/index.js";
import { db } from "./models/index.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const app = express();
const port = process.env.PORT || 3000;

db.authenticate()
  .then(() => console.log("Conectado a la base de datos"))
  .catch(err => console.error(err))

await db.sync();

app.set("view engine", "pug")

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//Middleware para autenticación
app.use((req, res, next) => {
  const token = req.cookies.access_token;
  let data = null;

  req.session = { user: null };

  try {
    data = jwt.verify(token, process.env.JWT_SECRET);
    req.session.user = data;
    res.locals.username = data.username;
  } catch { }

  next();
})

app.use('/', router);

//TODO: Cambiar imagen del hero y guardarla
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Aplicación escuchando en el puerto: ${port}`);
});

import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { Usuario } from "../models/Usuario.js";
import { validarLogin, validarRegistro } from "../validators/usuarioValidator.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, password, passwordConfirmation } = req.body;

  const erroresValidacion = await validarRegistro(username, password, passwordConfirmation);

  if (erroresValidacion.length > 0) {
    return res.render("registro", { errores: erroresValidacion, username: username });
  }

  await Usuario.create({
    id: crypto.randomUUID(),
    username: username,
    password: await bcrypt.hash(password, 10)
  })

  res.redirect('/login?registrado=true');
}

export const showLogin = (req, res) => {
  const { registrado } = req.query;

  res.render('login', {
    mensaje: registrado ? 'Cuenta creada con éxito, inicia sesión para continuar' : null
  });
}

export const authenticate = async (req, res) => {
  const { username, password } = req.body;

  const erroresValidacion = validarLogin(username);

  if (erroresValidacion.length > 0) {
    return res.render("login", { errores: erroresValidacion });
  }

  const user = await Usuario.findOne({ username });

  if (!user) {
    return res.render("login", { errores: [`El usuario "${username}" no existe`] });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.render("login", { errores: ["Las credenciales no son correctas"], username: username });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  //TODO: Cambiar redirect
  res.cookie('access_token', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 // 1 hora
  }).redirect('/build');
}

export const logout = (req, res) => {
  res.clearCookie('access_token')
    .redirect('/login');
}

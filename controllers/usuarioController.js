import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { Usuario, Build, Pieza, Comentario } from "../models/index.js";
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

  const user = await Usuario.findOne({ where: { username } });

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

  res.cookie('access_token', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 // 1 hora
  }).redirect('/profile');
}

export const logout = (req, res) => {
  res.clearCookie('access_token')
    .redirect('/login');
}

export const showProfile = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const userBuilds = await Build.findAll({
    where: { userId: req.session.user.id },
    include: [
      { model: Pieza, as: 'cpu' },
      { model: Pieza, as: 'motherboard' },
      { model: Pieza, as: 'memory' },
      { model: Pieza, as: 'gpu' },
      { model: Pieza, as: 'cooler' },
      { model: Pieza, as: 'case' },
      { model: Pieza, as: 'psu' },
      { model: Pieza, as: 'storage' },
      { 
        model: Comentario, 
        include: [{ model: Usuario, attributes: ['username'] }] 
      }
    ]
  });

  res.render('perfil', {
    builds: userBuilds,
    username: req.session.user.username
  });
}

//TODO: Método para ver otros perfiles
// si el usuario que hace la request es el mismo de la url
// redirigir a /profile O MEJOR, renderizar el perfil )?

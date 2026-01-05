import { Usuario } from "../models/Usuario.js";

export const validarRegistro = async (username, password, passwordConfirmation) => {
  const errores = [];

  validarUsername(username, errores);

  if (password.length < 8) {
    errores.push("La contraseña debe de tener al menos 8 caracteres");
  }

  if (await Usuario.findOne({ where: { username } })) {
    errores.push("Nombre de usuario no disponible");
  }

  if (password !== passwordConfirmation) {
    errores.push("Las contraseñas no coinciden");
  }

  return errores;
};

export const validarLogin = (username, password) => {
  const errores = [];

  validarUsername(username, errores);

  return errores;
}

const validarUsername = (username, errores) => {
  if (username.length < 4) {
    errores.push("El nombre debe de tener al menos 4 caracteres");
  }
}

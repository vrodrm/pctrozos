import Sequelize from 'sequelize';
import db from '../config/db.js';

export const Comentario = db.define('comments', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
  },
  //TODO: Revisar que tenga 255 caracteres de máximo
  contenido: {
    type: Sequelize.STRING,
  }
});


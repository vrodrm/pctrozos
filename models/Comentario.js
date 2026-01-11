import Sequelize from 'sequelize';
import db from '../config/db.js';

export const Comentario = db.define('comments', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
  },
  contenido: {
    type: Sequelize.STRING,
  }
});


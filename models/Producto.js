import Sequelize from 'sequelize';
import db from '../config/db.js';

export const Producto = db.define('productos', {
  type: {
    type: Sequelize.STRING,
  },
  name: {
    type: Sequelize.STRING,
  },
  image_url: {
    type: Sequelize.STRING,
  }
});

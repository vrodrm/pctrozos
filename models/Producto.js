import Sequelize from 'sequelize';
import db from '../config/db.js';

export const Producto = db.define('products', {
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

import Sequelize from 'sequelize';
import db from '../config/db.js';
import { Build } from './Build.js';

export const Pieza = db.define('parts', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  type: {
    type: Sequelize.STRING,
  },
  name: {
    type: Sequelize.STRING,
  },
  image_url: {
    type: Sequelize.STRING,
  },
  price: {
    type: Sequelize.FLOAT
  }
});

import Sequelize from 'sequelize';
import db from '../config/db.js';
import { Build } from './Build.js';

export const Usuario = db.define('users', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
  },
  username: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  }
});

//Usuario.hasMany(Build);

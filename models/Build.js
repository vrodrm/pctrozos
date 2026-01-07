import Sequelize from 'sequelize';
import db from '../config/db.js';

//TODO: añadir titulo
export const Build = db.define('builds', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
  },
});


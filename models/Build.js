import Sequelize from 'sequelize';
import db from '../config/db.js';

export const Build = db.define('builds', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
  },
});


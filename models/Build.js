import Sequelize from 'sequelize';
import db from '../config/db.js';
import { Usuario } from './Usuario.js';

export const Build = db.define('builds', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
  },
});

//Build.belongsTo(Usuario);
//Build.belongsToMany(Part, { through: 'BuildParts' });

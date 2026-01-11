import db from '../config/db.js'
import { Usuario } from "./Usuario.js";
import { Build } from "./Build.js";
import { Pieza } from "./Pieza.js";
import { Comentario } from "./Comentario.js";

Usuario.hasMany(Build);
Usuario.hasMany(Comentario);

Build.belongsTo(Usuario);
Build.hasMany(Comentario);

Comentario.belongsTo(Usuario);
Comentario.belongsTo(Build);

Build.belongsTo(Pieza, { as: 'cpu', foreignKey: 'cpuId' });
Build.belongsTo(Pieza, { as: 'motherboard', foreignKey: 'motherboardId' });
Build.belongsTo(Pieza, { as: 'memory', foreignKey: 'memoryId' });
Build.belongsTo(Pieza, { as: 'gpu', foreignKey: 'gpuId' });
Build.belongsTo(Pieza, { as: 'cooler', foreignKey: 'coolerId' });
Build.belongsTo(Pieza, { as: 'case', foreignKey: 'caseId' });
Build.belongsTo(Pieza, { as: 'psu', foreignKey: 'psuId' });
Build.belongsTo(Pieza, { as: 'storage', foreignKey: 'storageId' });

export {
  db,
  Usuario,
  Build,
  Pieza,
  Comentario
}


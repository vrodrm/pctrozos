import { Build, Pieza } from '../models/index.js';
import { Op } from 'sequelize';
import crypto from 'node:crypto';

const categorias = [
  { id: 'cpu', nombre: 'CPU' },
  { id: 'motherboard', nombre: 'Placa Base' },
  { id: 'memory', nombre: 'Memoria RAM' },
  { id: 'gpu', nombre: 'GPU' },
  { id: 'cooler', nombre: 'Refrigeración' },
  { id: 'case', nombre: 'Caja' },
  { id: 'psu', nombre: 'Fuente de alimentación' },
  { id: 'storage', nombre: 'Almacenamiento' }
]

export const showBuild = async (req, res) => {
  if (req.session.user === null) {
    return res.redirect('/login');
  }

  res.render("build", {
    categorias: categorias,
  })
}

export const getPiezas = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (category) whereClause.type = category;
    if (search) whereClause.name = { [Op.like]: `%${search}%` };

    const { count, rows } = await Pieza.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset
    });

    res.json({
      piezas: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error recuperando piezas." });
  }
}

export const saveBuild = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Debes iniciar sesión para guardar builds");
  }

  const { partIds } = req.body;

  try {
    await Build.create({
      id: crypto.randomUUID(),
      userId: req.session.user.id,
      cpuId: partIds[0],
      motherboardId: partIds[1],
      memoryId: partIds[2],
      gpuId: partIds[3],
      coolerId: partIds[4],
      caseId: partIds[5],
      psuId: partIds[6],
      storageId: partIds[7]
    })

    res.redirect('/profile');
  } catch (error) {
    res.status(500).send("Error al guardar");
  }
}

export const deleteBuild = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { id } = req.params;

  try {
    const build = await Build.findOne({ where: { id, userId: req.session.user.id } });

    if (!build) {
        return res.status(404).send("Build no encontrada o no autorizada");
    }

    await build.destroy();

    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar la build");
  }
}

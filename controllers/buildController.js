import { Pieza } from "../models/Pieza.js"
import { Op } from 'sequelize';

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
    res.status(500).json({ message: "Error fetching parts" });
  }
}

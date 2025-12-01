import { Router } from "express";
import { Producto } from "../models/Producto.js"

const router = Router();

router.get('/', async (req, res) => {
  let productos = await Producto.findAll();

  console.log(productos)

  res.render("index", {
    productos: productos,
  })
});

export default router;


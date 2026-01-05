import { Router } from "express";
import { authenticate, register, showLogin, logout } from "../controllers/usuarioController.js";
import { showBuild, getPiezas } from "../controllers/buildController.js";

const router = Router();

router.get('/', (req, res) => {
  res.render('landing');
})

router.get('/build', showBuild);
router.get('/api/piezas', getPiezas);

router.get('/login', showLogin);
router.post('/login', authenticate)

router.get('/register', (req, res) => {
  res.render('registro');
})

router.post('/register', register);

router.post('/logout', logout);

export default router;


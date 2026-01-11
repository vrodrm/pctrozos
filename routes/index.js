import { Router } from "express";
import { authenticate, register, showLogin, logout, showProfile, searchProfiles, viewProfile } from "../controllers/usuarioController.js";
import { showBuild, getPiezas, saveBuild, deleteBuild } from "../controllers/buildController.js";
import { postComment } from "../controllers/comentarioController.js";

const router = Router();

router.get('/', (req, res) => {
  res.render('landing');
})

router.get('/search', searchProfiles);

router.get('/build', showBuild);
router.post('/build/save', saveBuild);
router.post('/build/delete/:id', deleteBuild);

router.get('/api/piezas', getPiezas);

router.get('/login', showLogin);
router.post('/login', authenticate)

router.get('/register', (req, res) => {
  res.render('registro');
})

router.post('/register', register);

router.post('/logout', logout);

router.get('/profile', showProfile);
router.get('/profile/:id', viewProfile);

router.post('/comment', postComment);

export default router;


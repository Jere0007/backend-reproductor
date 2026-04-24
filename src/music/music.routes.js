import { Router } from 'express';
import { searchMusic } from './music.controller.js'; // Ajusta la ruta según tu carpeta

const router = Router();

router.get('/search', searchMusic);

export default router;
import { Router } from 'express';
import { searchMusic } from './music.controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.get(
    '/search', 
    [
        validarJWT
    ],
    searchMusic);

export default router;
import { Router } from "express";
import { createPlaylist, addSong, getPlaylistsByUser, getMyPlaylists, updateVisibility } from "./playlist.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js"; // Tu middleware de siempre

const router = Router();

// Crear playlist (Protegida)
router.post("/", [validarJWT], createPlaylist);

// Agregar canción a una playlist (Protegida)
router.patch("/add-song/:pid", [validarJWT], addSong);

// Ver MIS propias playlists (Ruta protegida)
router.get("/me", [validarJWT], getMyPlaylists);

// Ver playlists de un usuario (Pública o Protegida, tú eliges)
router.get("/user/:uid", getPlaylistsByUser);

// Actualizar la visibilidad de la playlist (PUBLIC/PRIVATE)
router.patch("/visibility/:pid", [validarJWT], updateVisibility);

export default router;
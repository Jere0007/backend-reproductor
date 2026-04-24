import { Router } from "express";
import { check } from "express-validator";
import { 
    createPlaylist, 
    addSong, 
    getPlaylistsByUser, 
    getMyPlaylists, 
    updateVisibility 
} from "./playlist.controller.js";

import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { playlistExistsById, userExistsById, validVisibility } from "../helpers/db-validator.js";

const router = Router();

// 1. Crear playlist
router.post(
    "/", 
    [
        validarJWT,
        check("namePlaylist", "El nombre de la playlist es obligatorio").not().isEmpty(),
        validarCampos
    ], 
    createPlaylist
);

// 2. Agregar canción (PATCH)
router.patch(
    "/add-song/:pid",
    [
        validarJWT,
        check("pid", "No es un ID de MongoDB válido").isMongoId(),
        check("pid").custom(playlistExistsById),
        check("videoId", "El videoId de YouTube es obligatorio").not().isEmpty(),
        validarCampos
    ], 
    addSong
);

// 3. Ver MIS playlists
router.get(
    "/me", 
    [
        validarJWT
    ], 
    getMyPlaylists
);

// 4. Ver playlists de OTRO usuario
router.get(
    "/user/:uid", 
    [
        validarJWT,
        check("uid", "No es un ID de MongoDB válido").isMongoId(),
        check("uid").custom(userExistsById),
        validarCampos
    ], 
    getPlaylistsByUser
);

// 5. Actualizar visibilidad
router.patch(
    "/visibility/:pid", 
    [
        validarJWT,
        check("pid", "No es un ID de MongoDB válido").isMongoId(),
        check("pid").custom(playlistExistsById),
        check("visibility").custom(validVisibility),
        validarCampos
    ], 
    updateVisibility
);

export default router;
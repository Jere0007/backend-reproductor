import { Router } from "express";
import { getUsers, updateUser, deleteUser } from "./user.controller.js";
import { deleteFileOnError } from "../middlewares/deleteFileOnErrors.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get(
    "/listUsers",
    deleteFileOnError,
    getUsers
);

router.put(
    "/updateUser/:id",
    validarJWT,
    deleteFileOnError,
    [
        check("id", "No es un id valido").isMongoId(),
        validarCampos
    ],
    updateUser
);

router.delete(
    "/deleteUser/:id",
    validarJWT,
    deleteFileOnError,
    [
        check("id", "No es un id valido").isMongoId(),
        validarCampos
    ],
    deleteUser
);

export default router;
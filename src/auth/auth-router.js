import { Router } from "express";
import { check } from "express-validator";
import { login, register } from "./auth-controller.js";
import { deleteFileOnError } from "../middlewares/deleteFileOnErrors.js";
import { usernameExists, emailExists, isValidEmailFormat } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.post(
    '/login',
    deleteFileOnError,
    login
);

router.post(
    "/register",
    [
        check("username").custom(usernameExists),
        check("email").custom(isValidEmailFormat),
        check("email").custom(emailExists),
        check("password", "La contraseña debe tener al menos 6 caracteres.").isLength({ min: 6 }),
        validarCampos // IMPORTANTE: Este middleware detiene la ejecución si hay errores
    ],
    register
);

export default router;
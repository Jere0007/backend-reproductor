import { Router } from "express";
import { login, register } from "./auth-controller.js";
import { deleteFileOnError } from "../middlewares/deleteFileOnErrors.js";

const router = Router();

router.post(
    '/login',
    deleteFileOnError,
    login
);

router.post(
    '/register',
    deleteFileOnError,
    register
);

export default router;
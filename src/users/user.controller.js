import { response, request } from "express";
import User from "./user.model.js";

export const getUsers = async (req = request, res = response) => {
    try {
        const query = { status: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
        ])

        res.status(200).json({
            success: true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener los usuarios',
            error: error.message || error
        })
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, password, email, ...data } = req.body;
        const user = await User.findByIdAndUpdate(id, data, {new: true})

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            msg: 'Usuario Actualizado',
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar el usuario",
            error: error.message || error
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(id, { status: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario eliminado correctamente',
            user: updatedUser
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Hubo un error al eliminar el usuario',
            error: error.message || error
        })
    }
};
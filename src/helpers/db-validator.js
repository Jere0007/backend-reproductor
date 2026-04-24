import User from '../users/user.model.js';
import Playlist from '../playList/playlist.model.js';

/**
 * VALIDACIONES DE USUARIO
 */

export const userExistsById = async (id) => {
    const exists = await User.findById(id);
    if (!exists) {
        throw new Error(`El usuario con ID ${id} no existe`);
    }
};

export const isValidEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("El formato del correo es totalmente inválido");
    }
    return true;
};

// Verificar si el email ya existe
export const emailExists = async (email = '') => {
    const exists = await User.findOne({ email });
    if (exists) {
        // Al lanzar el Error aquí, el 'check().custom()' lo atrapa y lo manda al validarCampos
        throw new Error(`El correo ${email} ya está registrado`);
    }
};

// Verificar si el username ya existe
export const usernameExists = async (username = '') => {
    const exists = await User.findOne({ username });
    if (exists) {
        throw new Error(`El nombre de usuario ${username} ya está en uso.`);
    }
};

/**
 * VALIDACIONES DE PLAYLIST
 */

// Verificar si la playlist existe por ID
export const playlistExistsById = async (id) => {
    const exists = await Playlist.findById(id);
    if (!exists) {
        throw new Error(`La playlist con ID ${id} no existe`);
    }
};

// Validar que la visibilidad sea solo PUBLIC o PRIVATE
export const validVisibility = (visibility) => {
    const options = ['PUBLIC', 'PRIVATE'];
    if (!options.includes(visibility)) {
        throw new Error(`La visibilidad debe ser una de estas: ${options.join(', ')}`);
    }
    return true;
};
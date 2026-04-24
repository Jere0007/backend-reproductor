import User from '../users/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email && !username) {
            return res.status(400).json({
                success: false,
                msg: "Debes proporcionar email o username"
            });
        }

        const user = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "El email o username no existen en la base de datos"
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                msg: 'La contraseña es incorrecta'
            });
        }

        const token = await generarJWT(user.id);

        res.status(200).json({
            success: true,
            msg: 'Inicio de sesión exitoso',
            userDetails: user,
            token: token
            
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'server error',
            error: e.message
        });
    }
};

export const register = async (req, res) => {
  try {
    const data = req.body;

    // Encriptar contraseña
    const encryptedPassword = await hash(data.password);

    // Crear usuario
    const user = await User.create({
      profilePhoto: data.profilePhoto,
      name: data.name,
      surname: data.surname,
      username: data.username,
      email: data.email,
      password: encryptedPassword,
      birthday: data.birthday,
      role: data.role,
    });

    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      userDetails: {
        user: [user.username, user.email, user.role],
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error en el registro de usuario",
      error: error.message,
    });
  }
};


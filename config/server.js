import express from 'express';
import cors from 'cors';
import helmet from "helmet";
import morgan from "morgan";
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth-router.js';
import userRoutes from '../src/users/user.routes.js';
import musicRoutes from '../src/music/music.routes.js';
import playlistRoutes from '../src/playList/playlist.routes.js';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended : false }));
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) => {
    app.use('/reproductor/v1/auth', authRoutes);
    app.use('/reproductor/v1/users', userRoutes);
    app.use('/reproductor/v1/music', musicRoutes);
    app.use('/reproductor/v1/playlists', playlistRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log('Conexion exitosa con la base de datos');
    } catch (error) {
        console.log('Error al conectar con la base de datos', error);
    }
}

export const initserver = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port)
        console.log(`Server running on port ${port}`)
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }

}
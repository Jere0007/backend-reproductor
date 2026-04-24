import Playlist from "./playlist.model.js";
import axios from "axios";

export const createPlaylist = async (req, res) => {
    try {
        const data = req.body;
        // El owner es el usuario logueado (esto viene de tu validar-jwt)
        data.owner = req.usuario._id; 

        const playlist = new Playlist(data);
        await playlist.save();

        res.status(201).json({
            success: true,
            message: 'Playlist creada con éxito',
            playlist
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la playlist',
            error: err.message
        });
    }
}

export const addSong = async (req, res) => {
    const { pid } = req.params;
    const { videoId } = req.body; // <--- Ahora solo recibimos esto
    const API_KEY = process.env.YOUTUBE_API_KEY;

    try {
        // 1. Buscamos la playlist y verificamos dueño
        const playlist = await Playlist.findById(pid);
        if (!playlist) return res.status(404).json({ message: 'Playlist no encontrada' });
        
        if (playlist.owner.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ message: 'No tienes permiso para editar esta lista' });
        }

        // 2. Evitamos duplicados antes de llamar a la API (para ahorrar cuota)
        const songExists = playlist.songs.find(song => song.videoId === videoId);
        if (songExists) {
            return res.status(400).json({ message: 'Esta canción ya está en tu playlist' });
        }

        // 3. Traemos la información AUTOMÁTICAMENTE desde YouTube
        const ytResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet', // Pedimos el snippet para obtener título, canal y fotos
                id: videoId,
                key: API_KEY
            }
        });

        // 4. Verificamos si el ID realmente existe en YouTube
        if (ytResponse.data.items.length === 0) {
            return res.status(400).json({ message: 'El videoId no es válido o no existe' });
        }

        // Extraemos los datos oficiales
        const videoData = ytResponse.data.items[0].snippet;

        // 5. Guardamos la canción con la info oficial de Google
        playlist.songs.push({
            videoId: videoId,
            title: videoData.title,
            thumbnail: videoData.thumbnails.medium?.url || videoData.thumbnails.default?.url,
            channelTitle: videoData.channelTitle
        });

        await playlist.save();

        res.status(200).json({
            success: true,
            message: `Se agrego a tu playlist ${playlist.namePlaylist}`,
            playlist
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const getMyPlaylists = async (req, res) => {
    try {
        // Obtenemos el ID del usuario directamente desde el token validado
        // (Asumiendo que tu middleware 'validarJWT' guarda al usuario en 'req.usuario')
        const authenticatedUser = req.usuario;

        if (!authenticatedUser) {
            return res.status(401).json({
                success: false,
                message: 'Token invalid or user not found'
            });
        }

        // Buscamos solo las playlists que pertenecen al usuario logueado
        const playlists = await Playlist.find({ 
            owner: authenticatedUser._id, 
            status: true 
        });

        res.status(200).json({
            success: true,
            total: playlists.length,
            playlists
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching your playlists',
            error: err.message
        });
    }
};
export const getPlaylistsByUser = async (req, res) => {
    const { uid } = req.params;

    try {
        // Filtramos: que el dueño sea el uid Y que la visibilidad sea PUBLIC
        const playlists = await Playlist.find({ 
            owner: uid, 
            status: true,
            visibility: 'PUBLIC' // <--- Solo lo que el dueño quiere mostrar
        }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            total: playlists.length,
            playlists
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching playlists" });
    }
}

export const updateVisibility = async (req, res) => {
    const { pid } = req.params;
    const { visibility } = req.body; // 'PUBLIC' o 'PRIVATE'

    try {
        const playlist = await Playlist.findById(pid);
        
        if (playlist.owner.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ message: 'Esta playlist no te pertenece' });
        }

        playlist.visibility = visibility;
        await playlist.save();

        res.status(200).json({ success: true, message: `Playlist ahora es ${visibility}` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
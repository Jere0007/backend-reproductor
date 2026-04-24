import Playlist from "./playlist.model.js";
import axios from "axios";

export const createPlaylist = async (req, res) => {
    try {
        const data = req.body;
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
    const { videoId } = req.body; 
    const API_KEY = process.env.YOUTUBE_API_KEY;

    try {
        // Ya no validamos if(!playlist), el db-validator ya confirmó que existe
        const playlist = await Playlist.findById(pid);
        
        // Esta validación se queda porque depende del usuario que hace la petición
        if (playlist.owner.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: 'No tienes permiso para editar esta lista' 
            });
        }

        const songExists = playlist.songs.find(song => song.videoId === videoId);
        if (songExists) {
            return res.status(400).json({ 
                success: false, 
                message: 'Esta canción ya está en tu playlist' 
            });
        }

        const ytResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'snippet',
                id: videoId,
                key: API_KEY
            }
        });

        if (ytResponse.data.items.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'El videoId no es válido o no existe en YouTube' 
            });
        }

        const videoData = ytResponse.data.items[0].snippet;

        playlist.songs.push({
            videoId: videoId,
            title: videoData.title,
            thumbnail: videoData.thumbnails.medium?.url || videoData.thumbnails.default?.url,
            channelTitle: videoData.channelTitle
        });

        await playlist.save();

        res.status(200).json({
            success: true,
            message: `Se agregó a tu playlist: ${playlist.name}`,
            playlist
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export const getMyPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({ 
            owner: req.usuario._id, 
            status: true 
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: playlists.length,
            playlists
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener tus playlists',
            error: err.message
        });
    }
};

export const getPlaylistsByUser = async (req, res) => {
    const { uid } = req.params;

    try {
        // uid ya fue validado como existente en db-validator
        const playlists = await Playlist.find({ 
            owner: uid, 
            status: true,
            visibility: 'PUBLIC' 
        }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            total: playlists.length,
            playlists
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener playlists" });
    }
}

export const updateVisibility = async (req, res) => {
    const { pid } = req.params;
    const { visibility } = req.body;

    try {
        const playlist = await Playlist.findById(pid);
        
        if (playlist.owner.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: 'Esta playlist no te pertenece' 
            });
        }

        playlist.visibility = visibility;
        await playlist.save();

        res.status(200).json({ 
            success: true, 
            message: `Visibilidad actualizada a ${visibility}` 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
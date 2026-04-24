import axios from 'axios';

export const searchMusic = async (req, res) => {
    const { q, pageToken } = req.query;
    const API_KEY = process.env.YOUTUBE_API_KEY;

    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                maxResults: 25,
                q: q,
                type: 'video',
                videoCategoryId: '10',
                key: API_KEY,
                pageToken: pageToken || ''
            }
        });

        const songs = response.data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
            channel: item.snippet.channelTitle
        }));

        res.status(200).json({
            success: true,
            total: response.data.pageInfo.totalResults, // <--- Aquí agregamos el total
            nextPageToken: response.data.nextPageToken, // <--- MANDAMOS LA LLAVE AL FRONTEND
            prevPageToken: response.data.prevPageToken, // Por si quieres volver atrás
            count: songs.length, // Opcional: para saber cuántos mandas en esta tanda
            songs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar música',
            error: error.message
        });
    }
};
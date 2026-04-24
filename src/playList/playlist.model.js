import { Schema, model } from "mongoose";

const PlaylistSchema = Schema({
    namePlaylist: {
        type: String,
        required: [true, 'Playlist name is required'],
        maxLength: [50, 'Cannot exceed 50 characters'],
        trim: true
    },
    playlistImage: {
        type: String,
        default: "https://png.pngtree.com/element_our/20190528/ourmid/pngtree-playlist-icon-image_1128352.jpg",
        required: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user', 
        required: [true, 'Owner is required']
    },
    songs: [{
        videoId: {
            type: String,
            required: [true, 'YouTube Video ID is required']
        },
        title: {
            type: String,
            required: [true, 'Song title is required']
        },
        thumbnail: {
            type: String
        },
        channelTitle: {
            type: String
        }
    }],
    visibility: {
        type: String,
        enum: ['PUBLIC', 'PRIVATE'],
        default: 'PUBLIC' // Por defecto, que todos la vean
    },
    status: {
        type: Boolean,
        default: true // Esto sirve para "borrar" la playlist sin eliminarla de la base de datos
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

// Adaptado a tu estilo de limpieza de JSON
PlaylistSchema.methods.toJSON = function() {
    const { _id, ...playlist } = this.toObject();
    playlist.pid = _id; 
    return playlist;
}

export default model('playlist', PlaylistSchema);
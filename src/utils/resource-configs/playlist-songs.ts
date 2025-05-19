import { PlaylistSong } from "../../entities/playlist-song.entity.js";
import { UserAuthService } from "../../services/user-auth.service.js";

const PlaylistSongConfig = {
    resource: PlaylistSong,
    options: {
        listProperties: ['watchlistId', 'songId', 'position', 'syncedWithSpotify', 'createdAt'],
        showProperties: ['id', 'watchlistId', 'songId', 'position', 'syncedWithSpotify', 'watchlist', 'song', 'createdAt', 'updatedAt'],
        editProperties: ['watchlistId', 'songId', 'position', 'syncedWithSpotify'],
        actions: {
            delete: { isAccessible: ({ currentAdmin }) => UserAuthService.isSuperAdmin(currentAdmin) },
            bulkDelete: { isAccessible: ({ currentAdmin }) => UserAuthService.isSuperAdmin(currentAdmin) },
            new: {
                isAccessible: ({ currentAdmin }) =>
                    UserAuthService.canEdit(currentAdmin)
            },
            edit: {
                isAccessible: ({ currentAdmin }) =>
                    UserAuthService.canEdit(currentAdmin)
            },
            list: {
                isAccessible: ({ currentAdmin }) =>
                    true
            },
            show: {
                isAccessible: ({ currentAdmin }) =>
                    true
            },
        },
        navigation: {
            name: 'Content Management',
            icon: 'Playlist',
        },
    },
}

export default PlaylistSongConfig;
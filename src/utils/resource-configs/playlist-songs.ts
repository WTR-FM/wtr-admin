import { PlaylistSong } from "../../entities/playlist-song.entity.js";
import { AdminAuthService } from "../../services/admin-auth.service.js";
import { FormattedDate } from "../../types/components.bundler.js";

const PlaylistSongConfig = {
    resource: PlaylistSong,
    options: {
        listProperties: ['watchlistId', 'songId', 'position', 'syncedWithSpotify', 'createdAt'],
        showProperties: ['id', 'watchlistId', 'songId', 'position', 'syncedWithSpotify', 'watchlist', 'song', 'createdAt', 'updatedAt'],
        editProperties: ['watchlistId', 'songId', 'position', 'syncedWithSpotify'],
        properties: {
            createdAt: {
                components: {
                    list: FormattedDate,
                    show: FormattedDate,
                    filter: FormattedDate,
                },
                custom: {
                    customLabel: 'Created At'
                }
            },
            updatedAt: {
                components: {
                    show: FormattedDate,
                },
                custom: {
                    customLabel: 'Updated At'
                }
            },
        },
        actions: {
            delete: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
            bulkDelete: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
            new: {
                isAccessible: ({ currentAdmin }) =>
                    AdminAuthService.canEdit(currentAdmin)
            },
            edit: {
                isAccessible: ({ currentAdmin }) =>
                    AdminAuthService.canEdit(currentAdmin)
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
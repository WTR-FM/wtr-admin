import { Watchlist } from "../../entities/watchlist.entity.js";
import { AdminAuthService } from "../../services/admin-auth.service.js";
import { FormattedDate } from "../../types/components.bundler.js";

const WatchlistConfig = {
    resource: Watchlist,
    options: {
        listProperties: ['name', 'userId', 'isPublic', 'isCollaborative', 'createdAt'],
        showProperties: ['id', 'userId', 'name', 'description', 'imageUrl', 'isPublic', 'isCollaborative', 'spotifyPlaylistId', 'metadata', 'playlistSongs', 'createdAt', 'updatedAt'],
        editProperties: ['name', 'description', 'userId', 'isPublic', 'isCollaborative', 'imageUrl', 'spotifyPlaylistId', 'metadata'],
        filterProperties: ['name', 'userId', 'isPublic', 'isCollaborative', 'createdAt'],
        properties: {
            metadata: { type: 'mixed' },
            description: { type: 'textarea' },
            createdAt: {
                components: {
                    list: FormattedDate,
                    show: FormattedDate,
                    filter: FormattedDate,
                }
            },
            updatedAt: {
                components: {
                    show: FormattedDate,
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
            icon: 'Eye',
        },
    },
}

export default WatchlistConfig;
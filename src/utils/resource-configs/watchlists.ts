import { Watchlist } from "../../entities/watchlist.entity.js";
import { UserAuthService } from "../../services/user-auth.service.js";

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
        },
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
            icon: 'Eye',
        },
    },
}

export default WatchlistConfig;
import { Watchlist } from "../../entities/watchlist.entity.js";
import { AdminAuthService } from "../../services/admin-auth.service.js";
import { FormattedDate } from "../../types/components.bundler.js";

const WatchlistConfig = {
    resource: Watchlist,
    options: {
        listProperties: ['name', 'description', 'isPublic', 'isCollaborative', 'createdAt'],
        showProperties: [], // show everything
        editProperties: ['userId', 'name', 'description', 'imageUrl', 'isPublic', 'isCollaborative', 'isDraft', 'type'],
        filterProperties: ['name', 'isPublic', 'isCollaborative', 'isDraft', 'type'],
        properties: {
            metadata: { type: 'mixed' },
            description: { type: 'textarea' },
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
            icon: 'Eye',
        },
    },
}

export default WatchlistConfig;
import { Song } from "../../entities/song.entity.js";
import { AdminAuthService } from "../../services/admin-auth.service.js";
import { FormattedDate } from "../../types/components.bundler.js";

const SongConfig = {
    resource: Song,
    options: {
        listProperties: ['title', 'artist', 'album', 'source', 'createdAt'],
        showProperties: ['id', 'title', 'artist', 'album', 'source', 'sourceId', 'albumCover', 'durationMs', 'previewUrl', 'lyrics', 'metadata', 'createdAt', 'updatedAt'],
        editProperties: ['title', 'artist', 'album', 'sourceId', 'source', 'albumCover', 'durationMs', 'previewUrl', 'lyrics', 'metadata'],
        filterProperties: ['title', 'artist', 'album', 'source'],
        properties: {
            metadata: { type: 'mixed' },
            lyrics: { type: 'textarea' },
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
            icon: 'Music',
        },
    },
}

export default SongConfig;
import { Config } from "../../entities/config.entity.js";
import { AdminAuthService } from "../../services/admin-auth.service.js";
import { FormattedDate } from "../../types/components.bundler.js";

const ConfigConfig = {
    resource: Config,
    options: {
        listProperties: ['key', 'category', 'description', 'createdAt'],
        showProperties: ['id', 'key', 'value', 'category', 'description', 'createdAt', 'updatedAt'],
        editProperties: ['key', 'value', 'category', 'description'],
        filterProperties: ['key', 'category'],
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
            delete: { isAccessible: ({ currentAdmin }) => AdminAuthService.canEdit(currentAdmin) },
            bulkDelete: { isAccessible: ({ currentAdmin }) => AdminAuthService.canEdit(currentAdmin) },
            new: {
                isAccessible: ({ currentAdmin }) =>
                    AdminAuthService.canEdit(currentAdmin)
            },
            edit: {
                isAccessible: ({ currentAdmin }) =>
                    AdminAuthService.canEdit(currentAdmin)
            },
            list: {
                isAccessible: ({ currentAdmin }) => AdminAuthService.canEdit(currentAdmin)
            },
            show: {
                isAccessible: ({ currentAdmin }) => AdminAuthService.canEdit(currentAdmin)
            },
        },
        navigation: {
            name: 'System Settings',
            icon: 'Settings',
        },
    },
}

export default ConfigConfig; 
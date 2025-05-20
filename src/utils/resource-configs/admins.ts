import { Admin } from "../../entities/admin.entity.js";
import { AdminAuthService } from "../../services/admin-auth.service.js";
import { FormattedDate } from "../../types/components.bundler.js";

const AdminConfig = {
    resource: Admin,
    options: {
        listProperties: ['name', 'email', 'role', 'isSuspended', 'createdAt'],
        showProperties: ['id', 'firstName', 'lastName', 'email', 'role', 'isSuspended', 'createdAt', 'updatedAt'],
        editProperties: ['firstName', 'lastName', 'email', 'password', 'role', 'isSuspended'],
        filterProperties: ['name', 'email', 'role', 'isSuspended', 'createdAt'],

        properties: {
            password: {
                type: 'password',
                isVisible: {
                    list: false,
                    filter: false,
                    show: false,
                    edit: false,
                },
            },
            refreshToken: { isVisible: false },
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

        navigation: {
            name: null,
            icon: 'Users',
        },

        actions: {
            list: {
                isAccessible: ({ currentAdmin }) => true,
                before: async (request, context) => {
                    const { currentAdmin } = context;

                    if (!AdminAuthService.isSuperAdmin(currentAdmin)) {
                        request.query = {
                            ...request.query,
                            'filters.id': currentAdmin.id,
                        };
                    }

                    return request;
                },
            },

            show: {
                isAccessible: ({ currentAdmin, record }) =>
                    AdminAuthService.isSuperAdmin(currentAdmin) ||
                    (record && currentAdmin.id === record.param('id')),
            },

            edit: {
                isAccessible: ({ currentAdmin, record }) =>
                    AdminAuthService.isSuperAdmin(currentAdmin) ||
                    (record && currentAdmin.id === record.param('id')),
            },

            delete: {
                isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin),
            },

            new: {
                isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin),
            },

            bulkDelete: {
                isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin),
            },
        },
    },
}

export default AdminConfig;
import { FriendRequest } from "../../entities/friend-request.entity.js";
import { AdminAuthService } from "../../services/admin-auth.service.js";
import { FormattedDate } from "../../types/components.bundler.js";

const FriendRequestConfig = {
    resource: FriendRequest,
    options: {
        listProperties: ['requesterId', 'receiverId', 'status', 'createdAt'],
        showProperties: ['id', 'requesterId', 'receiverId', 'status', 'createdAt', 'updatedAt'],
        editProperties: ['requesterId', 'receiverId', 'status'],
        properties: {
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
            name: 'User Management',
            icon: 'Users',
        },
    },
}

export default FriendRequestConfig;
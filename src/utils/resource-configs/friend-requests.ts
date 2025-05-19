import { FriendRequest } from "../../entities/friend-request.entity.js";
import { UserAuthService } from "../../services/user-auth.service.js";

const FriendRequestConfig = {
    resource: FriendRequest,
    options: {
        listProperties: ['requesterId', 'receiverId', 'status', 'createdAt'],
        showProperties: ['id', 'requesterId', 'receiverId', 'status', 'createdAt', 'updatedAt'],
        editProperties: ['requesterId', 'receiverId', 'status'],
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
            name: 'User Management',
            icon: 'Users',
        },
    },
}

export default FriendRequestConfig;
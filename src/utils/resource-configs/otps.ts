import { Otp } from "../../entities/otp.entity.js";
import { UserAuthService } from "../../services/user-auth.service.js";

const OtpConfig = {
    resource: Otp,
    options: {
        listProperties: ['userId', 'otp', 'expiresAt', 'verified', 'createdAt'],
        showProperties: ['id', 'userId', 'otp', 'expiresAt', 'verified', 'createdAt', 'updatedAt'],
        editProperties: ['expiresAt', 'verified'],
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
            icon: 'Lock',
        },
    },
}

export default OtpConfig;
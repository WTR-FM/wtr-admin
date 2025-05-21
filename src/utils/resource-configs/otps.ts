import { Otp } from "../../entities/otp.entity.js";
import { AdminAuthService } from "../../services/admin-auth.service.js";
import { FormattedDate } from "../../types/components.bundler.js";

const OtpConfig = {
    resource: Otp,
    options: {
        listProperties: ['userId', 'otp', 'expiresAt', 'verified', 'createdAt'],
        showProperties: ['id', 'userId', 'otp', 'expiresAt', 'verified', 'createdAt', 'updatedAt'],
        editProperties: ['expiresAt', 'verified'],
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
            name: 'User Management',
            icon: 'Lock',
        },
    },
}

export default OtpConfig;

import { TOP } from "../../types/components.bundler.js";
import { User } from "../../entities/user.entity.js";
import { AdminAuthService } from "../../services/admin-auth.service.js";

const UserConfig = {
  resource: User,
  options: {
    listProperties: ['lastName', 'email', 'isSuspended', 'isVerified', 'spotifyStatus', 'createdAt'],
    showProperties: ['id', 'firstName', 'lastName', 'email', 'password', 'phoneNumber', 'spotifyTokens.expiry', 'country', 'state', 'pincode', 'about', 'isSuspended', 'isVerified', 'coinbaseWalletAddress', 'spotifyStatus', 'createdAt', 'updatedAt'],
    editProperties: ['firstName', 'lastName', 'email', 'password', 'isSuspended', 'isVerified'],
    filterProperties: ['firstName', 'lastName', 'email', 'isSuspended', 'isVerified', 'createdAt'],
    properties: {
      lastName: { components: { list: TOP } },
      'spotifyTokens.expiry': { isVisible: true, type: 'string'},
    },
    actions: {
      delete: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
      bulkDelete: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
      new: {
        isAccessible: ({ currentAdmin }) =>
          // Only superadmin and admin can create users
          AdminAuthService.canEdit(currentAdmin)
      },
      edit: {
        isAccessible: ({ currentAdmin }) =>
          // Only superadmin and admin can edit users
          AdminAuthService.canEdit(currentAdmin)
      },
      list: {
        isAccessible: ({ currentAdmin }) =>
          // All roles can see the list
          true
      },
      show: {
        isAccessible: ({ currentAdmin }) =>
          // All roles can see details
          true
      },
    },
    navigation: {
      name: 'User Management',
      icon: 'User',
    },
  },
}

export default UserConfig;
import { User } from "../../entities/user.entity.js";
import { AdminAuthService } from "../../services/admin-auth.service.js";
import { SpotifyTokenEdit, SpotifyTokenExpiry, FormattedDate } from "../../types/components.bundler.js";

const UserConfig = {
  resource: User,
  options: {
    listProperties: ['firstName', 'lastName', 'email', 'isSuspended', 'isVerified', 'createdAt'],
    showProperties: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'spotifyConnection', 'country', 'state', 'pincode', 'about', 'isSuspended', 'isVerified', 'coinbaseWalletAddress', 'spotifyStatus', 'createdAt', 'updatedAt'],
    editProperties: ['firstName', 'lastName', 'email', 'password', 'isSuspended', 'isVerified','spotifyConnectionEdit'],
    filterProperties: ['firstName', 'lastName', 'email', 'isSuspended', 'isVerified', 'createdAt'],
    properties: {
      password: {
        type: 'password',
        isVisible: {
          edit: false,
        },
      },
      'spotifyConnection': { 
        isVisible: true, 
        type: 'mixed',
        components: {
          show: SpotifyTokenExpiry
        },
        label: 'Spotify Tokens Expired'
      },
      'spotifyConnectionEdit': { 
        isVisible: true,
        components: {
          edit: SpotifyTokenEdit
        },
        label: 'Spotify Tokens Expired'
      },
      'createdAt': {
        isVisible: { list: true, show: true, filter: true },
        components: {
          list: FormattedDate,
          show: FormattedDate,
        }
      },
      'updatedAt': {
        isVisible: { show: true },
        components: {
          list: FormattedDate,
          show: FormattedDate,
        }
      },
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
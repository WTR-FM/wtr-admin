import { AdminAuthService } from '../services/admin-auth.service.js';
import { Admin } from '../entities/admin.entity.js';
import { User } from '../entities/user.entity.js';
import { Song } from '../entities/song.entity.js';
import { Watchlist } from '../entities/watchlist.entity.js';
import { PlaylistSong } from '../entities/playlist-song.entity.js';
import { FriendRequest } from '../entities/friend-request.entity.js';
import { Otp } from '../entities/otp.entity.js';

export const getResourceConfigurations = () => [
  {
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
  },
  {
    resource: User,
    options: {
      listProperties: ['firstName', 'lastName', 'email', 'isSuspended', 'isVerified', 'createdAt'],
      showProperties: ['id', 'firstName', 'lastName', 'email', 'password', 'phoneNumber', 'country', 'state', 'pincode', 'about', 'isSuspended', 'isVerified', 'coinbaseWalletAddress', 'refreshToken', 'spotifyTokens', 'createdAt', 'updatedAt'],
      editProperties: ['firstName', 'lastName', 'email', 'password', 'isSuspended', 'isVerified'],
      filterProperties: ['firstName', 'lastName', 'email', 'isSuspended', 'isVerified', 'createdAt'],
      properties: {
        password: { isVisible: false },
        refreshToken: { isVisible: false },
        spotifyTokens: { type: 'mixed' },
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
  },
  {
    resource: Song,
    options: {
      listProperties: ['title', 'artist', 'album', 'source', 'createdAt'],
      showProperties: ['id', 'title', 'artist', 'album', 'source', 'sourceId', 'albumCover', 'durationMs', 'previewUrl', 'lyrics', 'metadata', 'createdAt', 'updatedAt'],
      editProperties: ['title', 'artist', 'album', 'sourceId', 'source', 'albumCover', 'durationMs', 'previewUrl', 'lyrics', 'metadata'],
      filterProperties: ['title', 'artist', 'album', 'source', 'createdAt'],
      properties: {
        metadata: { type: 'mixed' },
        lyrics: { type: 'textarea' },
      },
      actions: {
        delete: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
        bulkDelete: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
        new: { 
          isAccessible: ({ currentAdmin }) => 
            // Only superadmin and admin can create songs
            AdminAuthService.canEdit(currentAdmin)
        },
        edit: { 
          isAccessible: ({ currentAdmin }) => 
            // Only superadmin and admin can edit songs
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
        name: 'Content Management',
        icon: 'Music',
      },
    },
  },
  {
    resource: Watchlist,
    options: {
      listProperties: ['name', 'userId', 'isPublic', 'isCollaborative', 'createdAt'],
      showProperties: ['id', 'userId', 'name', 'description', 'imageUrl', 'isPublic', 'isCollaborative', 'spotifyPlaylistId', 'metadata', 'playlistSongs', 'createdAt', 'updatedAt'],
      editProperties: ['name', 'description', 'userId', 'isPublic', 'isCollaborative', 'imageUrl', 'spotifyPlaylistId', 'metadata'],
      filterProperties: ['name', 'userId', 'isPublic', 'isCollaborative', 'createdAt'],
      properties: {
        metadata: { type: 'mixed' },
        description: { type: 'textarea' },
      },
      actions: {
        delete: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
        bulkDelete: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
        new: { 
          isAccessible: ({ currentAdmin }) => 
            // Only superadmin and admin can create watchlists
            AdminAuthService.canEdit(currentAdmin)
        },
        edit: { 
          isAccessible: ({ currentAdmin }) => 
            // Only superadmin and admin can edit watchlists
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
        name: 'Content Management',
        icon: 'Eye',
      },
    },
  },
  {
    resource: PlaylistSong,
    options: {
      listProperties: ['watchlistId', 'songId', 'position', 'syncedWithSpotify', 'createdAt'],
      showProperties: ['id', 'watchlistId', 'songId', 'position', 'syncedWithSpotify', 'watchlist', 'song', 'createdAt', 'updatedAt'],
      editProperties: ['watchlistId', 'songId', 'position', 'syncedWithSpotify'],
      actions: {
        delete: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
        bulkDelete: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
        new: { 
          isAccessible: ({ currentAdmin }) => 
            // Only superadmin and admin can create playlist songs
            AdminAuthService.canEdit(currentAdmin)
        },
        edit: { 
          isAccessible: ({ currentAdmin }) => 
            // Only superadmin and admin can edit playlist songs
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
        name: 'Content Management',
        icon: 'Playlist',
      },
    },
  },
  {
    resource: FriendRequest,
    options: {
      listProperties: ['requesterId', 'receiverId', 'status', 'createdAt'],
      showProperties: ['id', 'requesterId', 'receiverId', 'status', 'createdAt', 'updatedAt'],
      editProperties: ['requesterId', 'receiverId', 'status'],
      actions: {
        delete: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
        bulkDelete: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
        new: { 
          isAccessible: ({ currentAdmin }) => 
            // Only superadmin and admin can create friend requests
            AdminAuthService.canEdit(currentAdmin)
        },
        edit: { 
          isAccessible: ({ currentAdmin }) => 
            // Only superadmin and admin can edit friend requests
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
        icon: 'Users',
      },
    },
  },
  {
    resource: Otp,
    options: {
      listProperties: ['userId', 'otp', 'expiresAt', 'verified', 'createdAt'],
      showProperties: ['id', 'userId', 'otp', 'expiresAt', 'verified', 'createdAt', 'updatedAt'],
      editProperties: ['expiresAt', 'verified'],
      actions: {
        delete: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
        bulkDelete: { isAccessible: ({ currentAdmin }) => AdminAuthService.isSuperAdmin(currentAdmin) },
        new: { 
          isAccessible: ({ currentAdmin }) => 
            // Only superadmin and admin can create OTPs
            AdminAuthService.canEdit(currentAdmin)
        },
        edit: { 
          isAccessible: ({ currentAdmin }) => 
            // Only superadmin and admin can edit OTPs
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
        icon: 'Lock',
      },
    },
  },
]; 
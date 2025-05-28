import { Participation } from "../../entities/participation.entity.js";
import { AdminAuthService } from "../../services/admin-auth.service.js";
import { FormattedDate } from "../../types/components.bundler.js";

const ParticipationConfig = {
  resource: Participation,
  options: {
    listProperties: ['contestId', 'userId', 'teamTitle', 'rank', 'isLocked'],
    showProperties: ['id', 'contestId', 'userId', 'team', 'teamTitle', 'rank', 'isLocked', 'createdAt', 'updatedAt'],
    editProperties: ['contestId', 'userId', 'team', 'teamTitle', 'rank', 'isLocked'],
    filterProperties: ['contestId', 'userId', 'isLocked', 'rank'],
    properties: {
      'team': {
        isArray: true,
        type: 'string',
      },
      'isLocked': {
        type: 'boolean',
      },
      'rank': {
        type: 'number',
      },
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
        isAccessible: ({ currentAdmin }) => AdminAuthService.canEdit(currentAdmin)
      },
      edit: {
        isAccessible: ({ currentAdmin }) => AdminAuthService.canEdit(currentAdmin)
      },
      list: {
        isAccessible: ({ currentAdmin }) => true
      },
      show: {
        isAccessible: ({ currentAdmin }) => true
      },
    },
    navigation: {
      name: 'Contest Management',
      icon: 'Award',
    },
  },
};

export default ParticipationConfig; 
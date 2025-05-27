import { Contest, ContestStatus, ContestType } from "../../entities/contest.entity.js";
import { AdminAuthService } from "../../services/admin-auth.service.js";
import { FormattedDate } from "../../types/components.bundler.js";
import { GenreSlotsEdit } from "../../types/components.bundler.js";
import { GenreSlotsShow } from "../../types/components.bundler.js";

const ContestConfig = {
  resource: Contest,
  options: {
    listProperties: ['title', 'type', 'startTime', 'endTime', 'status'],
    showProperties: ['id', 'title', 'type', 'startTime', 'endTime', 'status', 'slots', 'xpRules', 'matchCriteria', 'createdAt', 'updatedAt'],
    editProperties: ['title', 'type', 'startTime', 'status', 'slots', 'xpRules', 'matchCriteria'],
    filterProperties: ['title', 'type', 'status'],
    properties: {
      'type': {
        availableValues: Object.entries(ContestType).map(([key, value]) => ({
          value,
          label: key,
        })),
      },
      'status': {
        availableValues: Object.entries(ContestStatus).map(([key, value]) => ({
          value,
          label: key,
        })),
      },
      'slots': {
        type: 'mixed',
        isArray: true,
        components: {
          show: GenreSlotsShow,
          edit: GenreSlotsEdit,
        },
      },
      'xpRules': {
        type: 'mixed',
      },
      'matchCriteria': {
        type: 'mixed',
      },
      startTime: {
        type: 'datetime',
        components: {
          list: FormattedDate,
          show: FormattedDate,
          filter: FormattedDate,
        },
        custom: {
          customLabel: 'Start Time'
        }
      },
      endTime: {
        type: 'datetime',
        components: {
          list: FormattedDate,
          show: FormattedDate,
        },
        custom: {
          customLabel: 'End Time'
        }
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
      icon: 'Gift',
    },
  },
};

export default ContestConfig; 
import { Contest, ContestStatus, ContestType } from "../../entities/contest.entity.js";
import { AdminAuthService } from "../../services/admin-auth.service.js";
import { FormattedDate, GenreSlotsEdit, GenreSlotsShow, ContestChangeLogs } from "../../types/components.bundler.js";

const ContestConfig = {
  resource: Contest,
  options: {
    listProperties: ['title', 'type', 'startTime', 'endTime', 'status'],
    showProperties: ['id', 'title', 'type', 'startTime', 'endTime', 'status', 'slots', 'createdAt', 'updatedAt', 'changeHistory'],
    editProperties: ['title', 'type', 'startTime', 'status', 'slots'],
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
      'changeHistory': {
        isVisible: {
          list: false,
          filter: false,
          show: true,
          edit: false,
        },
        components: {
          show: ContestChangeLogs,
        },
        custom: {
          customLabel: 'Change Logs',
        },
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
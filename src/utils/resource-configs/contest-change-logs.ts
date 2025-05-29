import { ContestChangeLog } from "../../entities/contest-change-log.entity.js";
import { FormattedDate, JSONViewerChangeLog } from "../../types/components.bundler.js";

const ContestChangeLogConfig = {
  resource: ContestChangeLog,
  options: {
    listProperties: ['contestId', 'adminId', 'description', 'createdAt'],
    showProperties: ['id', 'contestId', 'adminId', 'changes', 'description', 'createdAt', 'updatedAt'],
    editProperties: [], // Should not be editable
    filterProperties: ['contestId', 'adminId', 'createdAt'],
    properties: {
      'changes': {
        type: 'mixed',
        isVisible: {
          list: false,
          filter: false,
          show: true,
          edit: false,
        },
        components: {
          show: JSONViewerChangeLog,
        },
      },
      createdAt: {
        components: {
          list: FormattedDate,
          show: FormattedDate,
          filter: FormattedDate,
        },
        custom: {
          customLabel: 'Logged At'
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
      delete: { isAccessible: false }, // Change logs should not be deletable
      bulkDelete: { isAccessible: false },
      new: { isAccessible: false }, // Change logs should be created programmatically
      edit: { isAccessible: false }, // Change logs should not be editable
      list: { isAccessible: ({ currentAdmin }) => true },
      show: { isAccessible: ({ currentAdmin }) => true },
    },
    navigation: {
      name: 'Contest Management',
      icon: 'History'
    },
  },
};

export default ContestChangeLogConfig; 
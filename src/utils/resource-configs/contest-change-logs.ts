import { ContestChangeLog } from "../../entities/contest-change-log.entity.js";
import { AdminAuthService } from "../../services/admin-auth.service.js";
import { FormattedDate } from "../../types/components.bundler.js";

// Simple component to display changes in a readable format
const ChangesFormatter = ({ record }) => {
  const changes = record?.params?.changes || [];
  
  if (!changes || changes.length === 0) {
    return 'No changes';
  }

  return {
    component: 'JSONViewer',
    props: { data: changes },
  };
};

const ContestChangeLogConfig = {
  resource: ContestChangeLog,
  options: {
    listProperties: ['contestId', 'userId', 'description', 'createdAt'],
    showProperties: ['id', 'contestId', 'userId', 'changes', 'description', 'createdAt', 'updatedAt'],
    editProperties: [], // Should not be editable
    filterProperties: ['contestId', 'userId', 'createdAt'],
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
          show: ChangesFormatter,
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
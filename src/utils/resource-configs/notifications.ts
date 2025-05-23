import { Notification } from '../../entities/notification.entity.js';
import { AdminAuthService } from "../../services/admin-auth.service.js";

const NotificationConfig = {
  resource: Notification,
  editProperties: ['template.email.body'],
  options: {
    listProperties: ['triggerName', 'template.email.subject', 'description'],
    showProperties: ['triggerName', 'description', 'template.email.subject', 'template.email.body', 'createdAt', 'updatedAt'],
    editProperties: ['triggerName', 'description', 'template.email.subject', 'template.email.body'],
    filterProperties: ['triggerName'],

    navigation: {
      name: 'Content Management',
      icon: 'Bell',
    },
    properties: {
      'template.email.body': {
        type: 'richtext',
        label: 'Email Body',
      },
      'template.email.subject': {
        type: 'text',
        label: 'Email Subject',
      },
      triggerName: {
        isTitle: true,
        position: 100,
        isRequired: true,
      },
      description: {
        position: 200,
        type: 'textarea',
      },
      createdAt: {
        isVisible: { list: true, filter: true, show: true, edit: false },
        position: 400,
      },
      updatedAt: {
        isVisible: { list: true, filter: false, show: true, edit: false },
        position: 500,
      },
    },
    actions: {
      delete: { isAccessible: ({ currentAdmin }) => AdminAuthService.canEdit(currentAdmin) },
      bulkDelete: { isAccessible: ({ currentAdmin }) => AdminAuthService.canEdit(currentAdmin) },
      new: {
        isAccessible: ({ currentAdmin }) =>
          AdminAuthService.canEdit(currentAdmin)
      },
      edit: {
        isAccessible: ({ currentAdmin }) =>
          AdminAuthService.canEdit(currentAdmin)
      },
      list: {
        isAccessible: ({ currentAdmin }) => true
      },
      show: {
        isAccessible: ({ currentAdmin }) => true
      },
    },
  },
};

export default NotificationConfig; 
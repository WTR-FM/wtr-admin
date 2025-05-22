import { Notification } from '../../entities/notification.entity.js';

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
      id: {
        isVisible: { list: true, filter: true, show: true, edit: false },
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
  },
};

export default NotificationConfig; 
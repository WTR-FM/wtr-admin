import { Notification } from '../../entities/notification.entity.js';

const NotificationConfig = {
  resource: Notification,
  options: {
    navigation: {
      name: 'Content Management',
      icon: 'Bell',
    },
    actions: {
      new: {
        before: async (request) => {
          // Ensure template is properly structured when creating
          if (request.payload.template) {
            try {
              // If it's a string, try to parse it
              if (typeof request.payload.template === 'string') {
                request.payload.template = JSON.parse(request.payload.template);
              }
              
              // Ensure the template has the required structure
              const template = request.payload.template;
              if (!template.email) template.email = { subject: '', body: '' };
              if (!template.push) template.push = { subject: '', body: '' };
            } catch (error) {
              throw new Error('Invalid template format. Please provide a valid JSON object.');
            }
          }
          return request;
        },
      },
      edit: {
        before: async (request) => {
          // Apply the same validation for edit action
          if (request.payload.template) {
            try {
              if (typeof request.payload.template === 'string') {
                request.payload.template = JSON.parse(request.payload.template);
              }
              
              const template = request.payload.template;
              if (!template.email) template.email = { subject: '', body: '' };
              if (!template.push) template.push = { subject: '', body: '' };
            } catch (error) {
              throw new Error('Invalid template format. Please provide a valid JSON object.');
            }
          }
          return request;
        },
      },
    },
    properties: {
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
      template: {
        position: 300,
        isRequired: true,
        type: 'mixed',
        components: {
          edit: 'NotificationTemplateEdit',
          show: 'NotificationTemplateShow',
        },
        custom: {
          defaultValue: JSON.stringify({
            email: { subject: '', body: '' },
            push: { subject: '', body: '' }
          }, null, 2)
        }
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
import React, { useState, useEffect } from 'react';
import { Box, Label, TextArea, Input, FormGroup, FormMessage } from '@adminjs/design-system';
import { EditPropertyProps } from 'adminjs';

const NotificationTemplateEdit: React.FC<EditPropertyProps> = (props) => {
  const { property, onChange, record } = props;
  
  // Initialize state with template from record or default empty structure
  const [template, setTemplate] = useState(() => {
    try {
      const initialValue = record.params[property.path] || 
        JSON.stringify({
          email: { subject: '', body: '' },
          push: { subject: '', body: '' }
        }, null, 2);
      
      return typeof initialValue === 'string' 
        ? JSON.parse(initialValue) 
        : initialValue;
    } catch (e) {
      console.error('Error parsing template JSON:', e);
      return {
        email: { subject: '', body: '' },
        push: { subject: '', body: '' }
      };
    }
  });
  
  // Update parent form when template changes
  useEffect(() => {
    onChange(property.path, template);
  }, [template]);

  // Handle changes to individual fields
  const handleChange = (section, field, value) => {
    setTemplate(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <Box>
      <FormGroup>
        <Label>Email Notification</Label>
        <Box mb="xl">
          <Label>Subject</Label>
          <Input
            value={template.email.subject || ''}
            onChange={(e) => handleChange('email', 'subject', e.target.value)}
          />
        </Box>
        <Box mb="xl">
          <Label>Body</Label>
          <TextArea
            value={template.email.body || ''}
            onChange={(e) => handleChange('email', 'body', e.target.value)}
            rows={5}
          />
        </Box>
      </FormGroup>

      <FormGroup>
        <Label>Push Notification</Label>
        <Box mb="xl">
          <Label>Subject</Label>
          <Input
            value={template.push.subject || ''}
            onChange={(e) => handleChange('push', 'subject', e.target.value)}
          />
        </Box>
        <Box mb="xl">
          <Label>Body</Label>
          <TextArea
            value={template.push.body || ''}
            onChange={(e) => handleChange('push', 'body', e.target.value)}
            rows={5}
          />
        </Box>
      </FormGroup>

      <FormMessage>
        Use the fields above to customize both email and push notification templates.
      </FormMessage>
    </Box>
  );
};

export default NotificationTemplateEdit; 
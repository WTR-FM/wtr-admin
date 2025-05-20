import React from 'react';
import { Box, Label, Text, Badge } from '@adminjs/design-system';
import { ShowPropertyProps } from 'adminjs';

const NotificationTemplateShow: React.FC<ShowPropertyProps> = (props) => {
  const { property, record } = props;
  
  // Parse template data
  let template;
  try {
    const templateValue = record.params[property.path];
    template = typeof templateValue === 'string' 
      ? JSON.parse(templateValue) 
      : templateValue;
  } catch (e) {
    return (
      <Box>
        <Badge variant="danger">Invalid template format</Badge>
        <Text>{String(record.params[property.path])}</Text>
      </Box>
    );
  }

  if (!template) {
    return <Text>No template data</Text>;
  }

  return (
    <Box>
      <Box mb="xl">
        <Label>Email Notification</Label>
        <Box mb="default" backgroundColor="grey20" p="md" borderRadius="default">
          <Box mb="sm">
            <Label>Subject:</Label>
            <Text>{template.email?.subject || 'Not set'}</Text>
          </Box>
          <Box>
            <Label>Body:</Label>
            <Text style={{ whiteSpace: 'pre-wrap' }}>{template.email?.body || 'Not set'}</Text>
          </Box>
        </Box>
      </Box>

      <Box mb="xl">
        <Label>Push Notification</Label>
        <Box backgroundColor="grey20" p="md" borderRadius="default">
          <Box mb="sm">
            <Label>Subject:</Label>
            <Text>{template.push?.subject || 'Not set'}</Text>
          </Box>
          <Box>
            <Label>Body:</Label>
            <Text style={{ whiteSpace: 'pre-wrap' }}>{template.push?.body || 'Not set'}</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NotificationTemplateShow; 
import React from 'react';
import { Box, Label, Text, Badge } from '@adminjs/design-system';
import { BasePropertyProps } from 'adminjs';

const JSONViewer: React.FC<BasePropertyProps> = (props) => {
  const { record, property, where } = props;
  
  // Get data from record params
  const data = record?.params?.[property.path];
  const displayLabel = property.custom?.customLabel || property.label || property.name;
  
  // Handle empty data
  if (!data || (Array.isArray(data) && data.length === 0)) {
    if (where === 'list') {
      return <Text fontWeight="normal" lineHeight="1" margin="0">No data</Text>;
    }
    
    return (
      <Box style={{ marginBottom: '24px' }}>
        <Label style={{ marginBottom: '0px' }}>{displayLabel}</Label>
        <Text fontWeight="normal">No data available</Text>
      </Box>
    );
  }

  // For list view, show a simple summary
  if (where === 'list') {
    return (
      <Text fontWeight="normal" lineHeight="1" margin="0">
        {Array.isArray(data) ? `${data.length} changes` : 'JSON data'}
      </Text>
    );
  }

  // Format the changes for display in show view
  const renderChanges = () => {
    if (Array.isArray(data)) {
      return data.map((change, index) => (
        <Box 
          key={index} 
          mb="lg" 
          p="md" 
          backgroundColor="grey20" 
          borderRadius="default"
        >
          <Box mb="sm">
            <Label>Field:</Label>
            <Text fontWeight="bold">{change.key}</Text>
          </Box>
          
          <Box mb="sm">
            <Label>Previous value:</Label>
            <Text style={{ whiteSpace: 'pre-wrap' }}>
              {typeof change.prevValue === 'object' && change.prevValue !== null
                ? JSON.stringify(change.prevValue, null, 2)
                : String(change.prevValue !== undefined ? change.prevValue : '-')}
            </Text>
          </Box>
          
          <Box>
            <Label>New value:</Label>
            <Text style={{ whiteSpace: 'pre-wrap' }}>
              {typeof change.newValue === 'object' && change.newValue !== null
                ? JSON.stringify(change.newValue, null, 2)
                : String(change.newValue !== undefined ? change.newValue : '-')}
            </Text>
          </Box>
        </Box>
      ));
    } else if (typeof data === 'object' && data !== null) {
      // Handle if it's not an array but a single object
      return (
        <Box p="md" backgroundColor="grey20" borderRadius="default">
          <Text style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(data, null, 2)}
          </Text>
        </Box>
      );
    } else {
      // Handle primitive values
      return (
        <Box p="md" backgroundColor="grey20" borderRadius="default">
          <Text>{String(data)}</Text>
        </Box>
      );
    }
  };

  // Show view - consistent with other components
  return (
    <Box style={{ marginBottom: '24px' }}>
      <Label style={{ marginBottom: '8px' }}>{displayLabel}</Label>
      {renderChanges()}
    </Box>
  );
};

export default JSONViewer; 
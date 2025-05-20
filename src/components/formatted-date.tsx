import { BasePropertyProps } from 'adminjs';
import { Box, Label, Text } from '@adminjs/design-system';
import React from 'react';
import dayjs from 'dayjs';

interface FormattedDateProps extends BasePropertyProps {
  customLabel?: string;
}

const FormattedDate: React.FC<FormattedDateProps> = ({ record, property, customLabel }) => {
  const rawValue = record.params[property.path];
  const formatted = rawValue ? dayjs(rawValue).format('DD-MM-YYYY HH:mm') : '-';
  
  let displayLabel = property.label || property.name;
  
  if (property.path === 'createdAt') {
    displayLabel = 'Created At';
  } else if (property.path === 'updatedAt') {
    displayLabel = 'Updated At';
  }
  
  // Use custom label if provided
  if (customLabel) {
    displayLabel = customLabel;
  }

  return (
    <Box style={{ marginBottom: '24px' }}>
      <Label style={{ marginBottom: '0px' }}>{displayLabel}</Label>
      <Text fontWeight="normal">
        {formatted}
      </Text>
    </Box>
  );
};

export default FormattedDate;

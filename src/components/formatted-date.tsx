import { BasePropertyProps } from 'adminjs';
import { Box, Label, Text } from '@adminjs/design-system';
import React from 'react';
import dayjs from 'dayjs';

const FormattedDate: React.FC<BasePropertyProps> = ({ record, property, where }) => {
  const rawValue = record.params[property.path];
  const formatted = rawValue ? dayjs(rawValue).format('DD-MM-YYYY HH:mm') : '-';

  const displayLabel = property.custom?.customLabel || property.label || property.name;

  if (where === 'filter') {
    // TODO: Add implementation for filter
    return null; 
  }

  if (where === 'list') {
    return (
      <Text fontWeight="normal" lineHeight="1" margin="0">
        {formatted}
      </Text>
    );
  }

  return (
    <Box style={{ marginBottom: '24px' }}>
      <Label style={{ marginBottom: '0px' }}>{displayLabel}</Label>
      <Text fontWeight="normal">{formatted}</Text>
    </Box>
  );
};

export default FormattedDate;

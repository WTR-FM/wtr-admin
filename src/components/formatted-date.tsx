import { BasePropertyProps } from 'adminjs';
import { Box, Label, Text } from '@adminjs/design-system';
import React from 'react';
import dayjs from 'dayjs';

const getTimeZoneAbbreviation = () => {
  try {
    const date = new Date();
    const formatted = new Intl.DateTimeFormat('en-US', {
      timeZoneName: 'short',
    }).formatToParts(date);
    const tz = formatted.find(part => part.type === 'timeZoneName');
    return tz?.value || 'UTC';
  } catch {
    return 'UTC';
  }
};

const FormattedDate: React.FC<BasePropertyProps> = ({ record, property, where }) => {
  const rawValue = record.params[property.path];
  const formatted = rawValue ? dayjs(rawValue).format('DD-MM-YYYY HH:mm') : '-';

  let displayLabel = property.custom?.customLabel || property.label || property.name;
  // displayLabel += ` (${getTimeZoneAbbreviation()})`;

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

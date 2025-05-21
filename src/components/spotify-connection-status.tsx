import { Box, Text, Label } from '@adminjs/design-system';
import React, { FC } from 'react';
import { getConnectionStatus } from '../utils/spotify-utils.js';
import { BasePropertyProps } from 'adminjs';

interface Props {
  record: {
    params: {
      'spotifyTokens.expiry'?: string;
    }
  },
  marginBottom?: string
}

const SpotifyConnectionStatus: FC<BasePropertyProps | Props> = (props) => {
  // Handle AdminJS BasePropertyProps format
  if ('property' in props && 'where' in props) {
    const { record, property, where } = props;
    const expiryDate = record.params['spotifyTokens.expiry'];
    const { statusText, statusColor } = getConnectionStatus(expiryDate);
    const displayLabel = property.custom?.customLabel || property.label || property.name;

    if (where === 'list') {
      return (
        <Text color={statusColor} fontWeight="normal" lineHeight="1" margin="0">
          {statusText}
        </Text>
      );
    }

    return (
      <Box style={{ marginBottom: '24px' }}>
        <Label style={{ marginBottom: '0px' }}>{displayLabel}</Label>
        <Text color={statusColor} fontWeight="normal">
          {statusText}
        </Text>
      </Box>
    );
  }
  
  // Handle original Props format for backwards compatibility
  const { record, marginBottom = '24px' } = props as Props;
  const { params } = record;
  const expiryDate = params['spotifyTokens.expiry'];
  const { statusText, statusColor } = getConnectionStatus(expiryDate);

  return (
    <Box style={{ marginBottom }}>
      <Label style={{ marginBottom: '0px' }}>Spotify Connection Status</Label>
      <Text color={statusColor} fontWeight="normal">
        {statusText}
      </Text>
    </Box>
  );
};

export default SpotifyConnectionStatus;
import { Box, Text, Label } from '@adminjs/design-system';
import React, { FC } from 'react';
import { getConnectionStatus } from '../utils/spotify-utils.js';

interface Props {
  record: {
    params: {
      'spotifyTokens.expiry'?: string;
    }
  },
  marginBottom?: string
}

const SpotifyConnectionStatus: FC<Props> = ({ record, marginBottom = '24px' }) => {
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
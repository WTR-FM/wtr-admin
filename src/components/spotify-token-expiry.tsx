import { Box, Text, Title, Label } from '@adminjs/design-system';
import React, { FC } from 'react';

interface Props {
  record: {
    params: {
      spotifyTokens?: any;
    }
  }
}

const SpotifyConnectionStatus: FC<Props> = ({ record: { params } }) => {
  // Get the spotifyTokens value

  if (!params['spotifyTokens.expiry']) {
    return (
      <Box style={{marginBottom: '24px'}}>
        <Label style={{marginBottom: '0px'}}>Spotify Connection Status</Label>
        <Text color={'error'} fontWeight="normal">
          Not Connected
        </Text>
      </Box>
    );
  }

  const expiry = new Date(params['spotifyTokens.expiry'])

  const now = Date.now();
  const isExpired = expiry.getTime() < now;

  return (
    <Box style={{marginBottom: '24px'}}>
      <Label style={{marginBottom: '0px'}}>Spotify Connection Status</Label>
      <Text color={isExpired ? 'error' : 'success'} fontWeight="normal">
        {isExpired ? `Expired on ${expiry.toLocaleString()}` : `Active till ${expiry.toLocaleString()}`}
      </Text>
    </Box>
  );
};

export default SpotifyConnectionStatus;
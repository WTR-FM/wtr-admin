import { Text } from '@adminjs/design-system';
import React, { FC } from 'react';

interface Props {
  record: {
    params: {
      'spotifyTokens.expiry': string;
    }
  }
}

const SpotifyTokenExpiry: FC<Props> = ({ record }) => {
  // Get the expiry timestamp from the record
  const expiryTimestamp = record?.params?.['spotifyTokens.expiry'];
  
  // Check if token exists and if it's expired
  const isExpired = expiryTimestamp 
    ? new Date(expiryTimestamp).getTime() < Date.now() 
    : true; // If no timestamp, consider it expired
  
  return (
    <Text color={isExpired ? 'error' : 'success'}>
      {isExpired ? 'Yes' : 'No'}
    </Text>
  );
};

export default SpotifyTokenExpiry;
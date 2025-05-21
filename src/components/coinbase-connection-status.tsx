import { BasePropertyProps } from 'adminjs';
import { Box, Label, Text } from '@adminjs/design-system';
import React from 'react';
import { getConnectionStatus } from '../utils/coinbase-utils.js';

const CoinbaseConnectionStatus: React.FC<BasePropertyProps> = ({ record, property, where }) => {
  const coinbaseWalletAddress = record.params.coinbaseWalletAddress;
  console.log('coinbaseWalletAddress:', coinbaseWalletAddress);
  const { statusText, statusColor } = getConnectionStatus(coinbaseWalletAddress);

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
};

export default CoinbaseConnectionStatus; 
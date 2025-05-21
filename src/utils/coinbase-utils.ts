export interface ConnectionStatus {
  isConnected: boolean;
  statusText: string;
  statusColor: string;
}

export const getConnectionStatus = (coinbaseWalletAddress?: string): ConnectionStatus => {
  if (!coinbaseWalletAddress) {
    return {
      isConnected: false,
      statusText: 'Not Connected',
      statusColor: 'error',
    };
  }

  return {
    isConnected: true,
    statusText: 'Connected',
    statusColor: 'success',
  };
}; 
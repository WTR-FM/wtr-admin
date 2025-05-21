export interface ConnectionStatus {
  isConnected: boolean;
  statusText: string;
  statusColor: string;
}

export const getConnectionStatus = (expiryDate?: string): ConnectionStatus => {
  if (!expiryDate) {
    return {
      isConnected: false,
      statusText: 'Not Connected',
      statusColor: 'error',
    };
  }
  
  const expiry = new Date(expiryDate);
  const isExpired = expiry.getTime() < Date.now();
  
  return {
    isConnected: true,
    statusText: isExpired 
      ? 'Expired' 
      : 'Connected',
    statusColor: isExpired ? 'error' : 'success',
  };
};
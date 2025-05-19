import { Box, Button } from '@adminjs/design-system';
import { useNotice } from 'adminjs';
import React, { FC, useState } from 'react';
import SpotifyConnectionStatus from './spotify-token-expiry.js';
import { getConnectionStatus } from '../utils/spotify-utils.js';

interface Props {
  record: {
    params: {
      'spotifyTokens.expiry'?: string;
      id?: string;
    }
  }
}

/**
 * Removes Spotify connection for a user
 * @param spotifyUserId The user ID to disconnect
 * @returns Promise with the API response
 */
const removeSpotifyConnection = async (spotifyUserId: string): Promise<any> => {
  try {
    console.log("Removing Spotify connection for user:", spotifyUserId);
    // Use absolute URL from environment variable
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/users/${spotifyUserId}/spotify/logout`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      throw new Error(`Failed to remove Spotify connection: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error removing Spotify connection:', error);
    throw error;
  }
};

/**
 * Refreshes Spotify token for a user
 * @param spotifyUserId The user ID to refresh token for
 * @returns Promise with the API response
 */
const refreshSpotifyToken = async (spotifyUserId: string): Promise<any> => {
  try {
    // Use absolute URL from environment variable
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/users/${spotifyUserId}/spotify/refresh`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh Spotify token: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error refreshing Spotify token:', error);
    throw error;
  }
};

const SpotifyConnectionEdit: FC<Props> = ({ record }) => {
  const expiryDate = record.params['spotifyTokens.expiry'];
  const userId = record.params.id;
  
  console.log('SpotifyConnectionEdit Component:', { 
    params: record.params,
    expiryDate,
    userId 
  });
  
  const { isConnected } = getConnectionStatus(expiryDate);
  const [isLoading, setIsLoading] = useState<{ remove: boolean; refresh: boolean }>({ 
    remove: false, 
    refresh: false 
  });
  const addNotice = useNotice();

  const removeHandler = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading({ ...isLoading, remove: true });
    
    try {
      if (!userId) {
        throw new Error('User ID is missing');
      }
      
      console.log(`Sending remove request to backend for user ${userId}`);
      await removeSpotifyConnection(userId);
      addNotice({
        message: 'Spotify connection removed successfully!',
        type: 'success',
      });
      // You might want to refresh the page or update the UI state here
      window.location.reload();
    } catch (error) {
      console.error('Error in removeHandler:', error);
      addNotice({
        message: error instanceof Error ? error.message : 'Failed to remove Spotify connection',
        type: 'error',
      });
    } finally {
      setIsLoading({ ...isLoading, remove: false });
    }
  };

  const refreshHandler = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading({ ...isLoading, refresh: true });
    
    try {
      if (!userId) {
        throw new Error('User ID is missing');
      }
      
      console.log(`Sending refresh request to backend for user ${userId}`);
      await refreshSpotifyToken(userId);
      addNotice({
        message: 'Spotify token refreshed successfully!',
        type: 'success',
      });
      // You might want to refresh the page or update the UI state here
      window.location.reload();
    } catch (error) {
      console.error('Error in refreshHandler:', error);
      addNotice({
        message: error instanceof Error ? error.message : 'Failed to refresh Spotify token',
        type: 'error',
      });
    } finally {
      setIsLoading({ ...isLoading, refresh: false });
    }
  };

  return (
    <Box>
      <SpotifyConnectionStatus record={record} marginBottom="0px" />

      {isConnected && (
        <Box mt="md" display="flex" style={{ gap: '8px' }}>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={removeHandler} 
            disabled={isLoading.remove}
          >
            {isLoading.remove ? 'Removing...' : 'Remove Connection'}
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={refreshHandler} 
            disabled={isLoading.refresh}
          >
            {isLoading.refresh ? 'Refreshing...' : 'Refresh Token'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SpotifyConnectionEdit;
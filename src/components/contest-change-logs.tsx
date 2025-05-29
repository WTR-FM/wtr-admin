import React, { useState, useEffect } from 'react';
import { Box, H3, Text, Label, Badge, Loader, Button, Pagination } from '@adminjs/design-system';
import { ApiClient, BasePropertyProps } from 'adminjs';
import dayjs from 'dayjs';

// Types for the component
interface ChangeLogItem {
  id: string;
  contestId: string;
  adminId: string;
  changes: Array<{
    key: string;
    prevValue: any;
    newValue: any;
  }>;
  description: string;
  createdAt: string;
  updatedAt: string;
  admin?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const ContestChangeLogs: React.FC<BasePropertyProps> = (props) => {
  const { record } = props;
  const contestId = record?.params?.id;

  const [logs, setLogs] = useState<ChangeLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const perPage = 5;

  // Format value for display
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '-';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  // Get admin name or "System" if no admin
  const getAdminName = (log: ChangeLogItem): string => {
    if (!log.admin) {
      return 'System';
    }
    return `${log.admin.firstName} ${log.admin.lastName}`;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return dayjs(dateString).format('DD-MM-YYYY HH:mm');
  };

  // Fetch logs from API
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const api = new ApiClient();
      const response = await api.resourceAction({
        resourceId: 'ContestChangeLogs',
        actionName: 'list',
        params: {
          'filters.contestId': contestId,
          sort: '-createdAt',
          limit: perPage,
          offset: (page - 1) * perPage,
        },
      });

      if (response.data) {
        setLogs(response.data.records);
        setTotal(response.data.totalCount);
      } else {
        setError('Failed to load change logs');
      }
    } catch (err) {
      console.error('Error fetching contest change logs:', err);
      setError('Error loading change logs');
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination
  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  // Fetch logs on mount and when page changes
  useEffect(() => {
    if (contestId) {
      fetchLogs();
    } else {
      setLoading(false);
      setError('Contest ID not found');
    }
  }, [contestId, page]);

  // Render loading state
  if (loading) {
    return (
      <Box>
        <H3>Change Logs</H3>
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <Loader />
        </Box>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box>
        <H3>Change Logs</H3>
        <Box backgroundColor="error" p="lg" borderRadius="default">
          <Text color="white">{error}</Text>
        </Box>
      </Box>
    );
  }

  // Render empty state
  if (!logs || logs.length === 0) {
    return (
      <Box mb="xl">
        <H3>Change Logs</H3>
        <Box p="xl" backgroundColor="grey20" borderRadius="default" textAlign="center">
          <Text>No change logs available for this contest</Text>
        </Box>
      </Box>
    );
  }

  // Render logs
  return (
    <Box mb="xl">
      <H3 mb="lg">Change Logs</H3>
      
      {logs.map((log) => (
        <Box 
          key={log.id} 
          mb="lg" 
          p="lg" 
          borderRadius="default"
          border="1px solid"
          borderColor="grey40"
          backgroundColor="white"
          boxShadow="0 1px 3px rgba(0,0,0,0.1)"
        >
          <Box display="flex" justifyContent="space-between" mb="md">
            <Box>
              <Label>Updated by</Label>
              <Text fontWeight="bold">{getAdminName(log)}</Text>
            </Box>
            <Box textAlign="right">
              <Label>Date</Label>
              <Text>{formatDate(log.createdAt)}</Text>
            </Box>
          </Box>
          
          {log.description && (
            <Box mb="md" p="sm" backgroundColor="grey20" borderRadius="default">
              <Text>{log.description}</Text>
            </Box>
          )}
          
          <Box>
            <Label>Changes</Label>
            {log.changes.map((change, index) => (
              <Box 
                key={index} 
                mt="sm" 
                p="md" 
                backgroundColor="grey10" 
                borderRadius="default"
              >
                <Box mb="sm">
                  <Label>Field</Label>
                  <Text fontWeight="bold">{change.key}</Text>
                </Box>
                
                <Box display="flex" flexDirection={['column', 'column', 'row']} justifyContent="space-between">
                  <Box flex="1" mb={['md', 'md', '0']} mr={[0, 0, 'md']}>
                    <Label>Previous value</Label>
                    <Text style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                      {formatValue(change.prevValue)}
                    </Text>
                  </Box>
                  
                  <Box flex="1">
                    <Label>New value</Label>
                    <Text style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                      {formatValue(change.newValue)}
                    </Text>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
      
      {total > perPage && (
        <Box mt="xl" display="flex" justifyContent="center">
          <Pagination
            page={page}
            perPage={perPage}
            total={total}
            onChange={handlePageChange}
          />
        </Box>
      )}
    </Box>
  );
};

export default ContestChangeLogs; 
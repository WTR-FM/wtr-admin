import React, { useState, useEffect } from 'react';
import { Box, H3, Text, Label, Badge, Loader, Pagination, Button } from '@adminjs/design-system';
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

function extractChanges(params) {
  const changes = [];

  Object.entries(params).forEach(([key, value]) => {
    const match = key.match(/^changes\.(\d+)\.(.+)$/);
    if (match) {
      const index = Number(match[1]);
      const fieldPath = match[2];

      if (!changes[index]) changes[index] = {};

      // Handle nested fields like newValue.good
      const fieldParts = fieldPath.split('.');
      let current = changes[index];

      for (let i = 0; i < fieldParts.length; i++) {
        const part = fieldParts[i];
        if (i === fieldParts.length - 1) {
          current[part] = value;
        } else {
          current[part] = current[part] || {};
          current = current[part];
        }
      }
    }
  });

  return changes;
}

const ContestChangeLogs: React.FC<BasePropertyProps> = (props) => {
  const { record } = props;
  const contestId = record?.params?.id;

  const [logs, setLogs] = useState<ChangeLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  // Toggle expanded state for a log
  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  // Format value for display with better handling
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if (typeof value === 'boolean') {
      return value ? 'True' : 'False';
    }
    if (Array.isArray(value)) {
      return value.length === 0 ? 'Empty array' : JSON.stringify(value, null, 2);
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
    return dayjs(dateString).format('MMM DD, YYYY HH:mm');
  };

  // Get relative time
  const getRelativeTime = (dateString: string): string => {
    const now = dayjs();
    const date = dayjs(dateString);
    const diffInHours = now.diff(date, 'hour');
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.format('MMM DD');
  };

  // Get change type and colors
  const getChangeType = (prevValue: any, newValue: any) => {
    if (prevValue === null || prevValue === undefined) {
      return { 
        type: 'Created', 
        color: 'success',
        bgColor: '#f0fdf4', // very light green
        borderColor: '#bbf7d0'
      };
    }
    if (newValue === null || newValue === undefined) {
      return { 
        type: 'Removed', 
        color: 'error',
        bgColor: '#fef2f2', // very light red
        borderColor: '#fecaca'
      };
    }
    return { 
      type: 'Updated', 
      color: 'primary',
      bgColor: '#fefce8', // very light yellow
      borderColor: '#fde047'
    };
  };

  // Format field name for better readability
  const formatFieldName = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Fetch logs from API
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const api = new ApiClient();
      const response = await api.resourceAction({
        resourceId: 'contest_change_logs',
        actionName: 'list',
        params: {
          'filters.contestId': contestId,
          sort: '-createdAt',
        },
      });

      if (response.data && response.data.records) {
        const transformedLogs = response.data.records.map(record => ({
          id: record.params.id,
          contestId: record.params.contestId,
          adminId: record.params.adminId,
          changes: extractChanges(record.params),
          description: record.params.description,
          createdAt: record.params.createdAt,
          updatedAt: record.params.updatedAt,
          admin: record.populated?.admin ? {
            id: record.populated.admin.id,
            firstName: record.populated.admin.params.firstName,
            lastName: record.populated.admin.params.lastName,
            email: record.populated.admin.params.email
          } : undefined
        }));

        setLogs(transformedLogs);
        setTotal(response.data.meta?.total || transformedLogs.length);
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

  // Fetch logs on mount and when page changes
  useEffect(() => {
    if (contestId) {
      fetchLogs();
    } else {
      setLoading(false);
      setError('Contest ID not found');
    }
  }, [contestId]);

  // Render loading state
  if (loading) {
    return (
      <Box mb="xl">
        <H3 mb="lg">Change History</H3>
        <Box display="flex" justifyContent="center" p="xxl">
          <Loader />
        </Box>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box mb="xl">
        <H3 mb="lg">Change History</H3>
        <Box p="lg" backgroundColor="error" borderRadius="default">
          <Text color="white">{error}</Text>
        </Box>
      </Box>
    );
  }

  // Render empty state
  if (!logs || logs.length === 0) {
    return (
      <Box mb="xl">
        <H3 mb="lg">Change History</H3>
        <Box p="xl" textAlign="center" backgroundColor="grey10" borderRadius="default">
          <Text color="grey60">No changes recorded yet</Text>
        </Box>
      </Box>
    );
  }

  // Main render
  return (
    <Box mb="xl">
      <H3 mb="lg">Change History</H3>

      {logs.map((log, logIndex) => {
        const isExpanded = expandedLogs.has(log.id);
        
        return (
          <Box
            key={log.id}
            mb="lg"
            backgroundColor="white"
            borderRadius="default"
            boxShadow="0 1px 3px rgba(0,0,0,0.1)"
            overflow="hidden"
          >
            {/* Header - Always visible and clickable */}
            <Box
              p="lg"
              backgroundColor="grey5"
              borderBottom="1px solid"
              borderBottomColor="grey20"
              cursor="pointer"
              onClick={() => toggleLogExpansion(log.id)}
              _hover={{ backgroundColor: "grey10" }}
              transition="background-color 0.2s"
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Text fontWeight="bold" fontSize="md">{getAdminName(log)}</Text>
                  <Text color="grey60" fontSize="sm">{getRelativeTime(log.createdAt)} • {formatDate(log.createdAt)}</Text>
                </Box>
                <Box display="flex" alignItems="center" gap="sm">
                  <Badge variant="outline" size="sm">
                    {log.changes?.length || 0} changes
                  </Badge>
                  <Text color="grey60" fontSize="lg" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    ▼
                  </Text>
                </Box>
              </Box>

              {/* Description - visible in collapsed state */}
              {log.description && (
                <Box mt="sm" p="sm" backgroundColor="blue10" borderRadius="sm">
                  <Text fontSize="sm" fontStyle="italic" color="grey70">"{log.description}"</Text>
                </Box>
              )}
            </Box>

            {/* Expandable content */}
            {isExpanded && (
              <Box p="lg">
                {log.changes && Array.isArray(log.changes) && log.changes.length > 0 ? (
                  <Box>
                    {log.changes.map((change, index) => {
                      const changeInfo = getChangeType(change.prevValue, change.newValue);
                      
                      return (
                        <Box 
                          key={index} 
                          mb="md" 
                          p="md"
                          borderRadius="sm"
                          style={{
                            backgroundColor: changeInfo.bgColor,
                            border: `1px solid ${changeInfo.borderColor}20`
                          }}
                        >
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb="sm">
                            <Text fontWeight="medium" fontSize="sm">{formatFieldName(change.key)}</Text>
                            <Badge 
                              variant="outline" 
                              color={changeInfo.color}
                              size="xs"
                            >
                              {changeInfo.type}
                            </Badge>
                          </Box>
                          
                          <Box display="flex" gap="md">
                            <Box flex="1">
                              <Label fontSize="xs" color="grey60" mb="xs">Previous</Label>
                              <Box
                                p="sm"
                                backgroundColor="rgba(255,255,255,0.7)"
                                borderRadius="sm"
                                minHeight="32px"
                                display="flex"
                                alignItems="center"
                              >
                                <Text fontSize="xs" style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                  {formatValue(change.prevValue)}
                                </Text>
                              </Box>
                            </Box>
                            
                            <Box display="flex" alignItems="center" px="xs">
                              <Text color="grey40">→</Text>
                            </Box>
                            
                            <Box flex="1">
                              <Label fontSize="xs" color="grey60" mb="xs">Current</Label>
                              <Box
                                p="sm"
                                backgroundColor="rgba(255,255,255,0.7)"
                                borderRadius="sm"
                                minHeight="32px"
                                display="flex"
                                alignItems="center"
                              >
                                <Text fontSize="xs" style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                  {formatValue(change.newValue)}
                                </Text>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Box p="md" backgroundColor="grey10" borderRadius="sm" textAlign="center">
                    <Text color="grey60" fontSize="sm">No detailed changes available</Text>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default ContestChangeLogs;
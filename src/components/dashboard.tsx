import React from 'react';
import { Box, H2, H5, Text, Illustration, Badge } from '@adminjs/design-system';
import { useNavigate } from 'react-router-dom';
import { IllustrationProps } from '@adminjs/design-system';

type CardProps = {
  title: string;
  description: string;
  icon: React.ReactElement<IllustrationProps>;
  path: string;
  badge?: {
    text: string;
    variant: 'primary' | 'success' | 'danger' | 'info' | 'secondary';
  };
};

const Card: React.FC<CardProps> = ({ title, description, icon, path, badge }) => {
  const navigate = useNavigate();

  return (
    <Box
      as="a"
      href={path}
      onClick={(e) => {
        e.preventDefault();
        navigate(path);
      }}
      style={{
        textDecoration: 'none',
        flex: '1 1 250px',
        maxWidth: '300px',
        minWidth: '220px',
        padding: '24px',
        margin: '16px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        border: '1px solid #E0E0E0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        textAlign: 'center',
        transition: 'all 0.2s ease-in-out',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.borderColor = '#5B5CE2';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
        e.currentTarget.style.borderColor = '#E0E0E0';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {badge && (
        <Badge variant={badge.variant} style={{ position: 'absolute', top: '10px', right: '10px' }}>
          {badge.text}
        </Badge>
      )}
      <Box my="md" style={{ width: '40px', height: '40px', margin: '0 auto' }}>
        {React.cloneElement(icon, { width: 40, height: 40 })}
      </Box>
      <H5 mt="lg" mb="sm" color="grey100">{title}</H5>
      <Text textAlign="center" color="grey60" fontSize="sm">
        {description}
      </Text>
    </Box>
  );
};

const Dashboard: React.FC = () => {
  return (
    <Box variant="grey" style={{ padding: '40px 20px' }}>
      <Box variant="card" style={{ padding: '32px', textAlign: 'center', marginBottom: '40px' }}>
        <H2 fontWeight="lighter" color="grey100">Welcome to WTR Admin Panel</H2>
        <Text mt="md" color="grey60">Manage your platform with these quick access sections</Text>
      </Box>

      <Box display="flex" flexWrap="wrap" justifyContent="center">
        <Card
          title="Manage Users"
          description="View and update user accounts, verify profiles, and manage connection status"
          icon={<Illustration variant="Planet" />}
          path="/admin/resources/users"
        />
        <Card
          title="Manage Admins"
          description="Configure administrator accounts and access permissions"
          icon={<Illustration variant="Astronaut" />}
          path="/admin/resources/admins"
        />
        <Card
          title="Watchlists"
          description="View and manage user watchlists and collections"
          icon={<Illustration variant="DocumentSearch" />}
          path="/admin/resources/watchlists"
        />
        <Card
          title="Songs"
          description="Browse and manage the music catalog"
          icon={<Illustration variant="Folders" />}
          path="/admin/resources/songs"
        />
        <Card
          title="Notifications"
          description="Manage email and push notification templates and triggers"
          icon={<Illustration variant="DocumentCheck" />}
          path="/admin/resources/notifications"
        />
        <Card
          title="Configs"
          description="View and update app configuration values"
          icon={<Illustration variant="Details" />}
          path="/admin/resources/configs"
        />
      </Box>
    </Box>
  );
};

export default Dashboard;

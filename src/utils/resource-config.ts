import UserConfig from './resource-configs/users.js';
import AdminConfig from './resource-configs/admins.js';
import SongConfig from './resource-configs/songs.js';
import WatchlistConfig from './resource-configs/watchlists.js';
import PlaylistSongConfig from './resource-configs/playlist-songs.js';
import FriendRequestConfig from './resource-configs/friend-requests.js';
import OtpConfig from './resource-configs/otps.js';
import NotificationConfig from './resource-configs/notifications.js';
import ConfigConfig from './resource-configs/configs.js';
import ContestConfig from './resource-configs/contests.js';
import ParticipationConfig from './resource-configs/participations.js';
import ContestChangeLogConfig from './resource-configs/contest-change-logs.js';

export const getResourceConfigurations = () => [
  AdminConfig,
  UserConfig,
  SongConfig,
  WatchlistConfig,
  ContestConfig,
  // ParticipationConfig,
  // ContestChangeLogConfig,
  // PlaylistSongConfig,
  // FriendRequestConfig,
  // OtpConfig,
  // NotificationConfig,
  ConfigConfig,
]; 
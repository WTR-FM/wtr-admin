import { ComponentLoader } from 'adminjs';
import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
export const componentLoader = new ComponentLoader();

export const add = (url: string, componentName: string): string =>
  componentLoader.add(componentName, path.join(__dirname, url));

// export const override = (url: string, componentName: OverridableComponent): string =>
//   componentLoader.override(componentName, path.join(__dirname, url));

// /**
//  * Overridable components
//  */
// override('components/top-bar', 'Version');
// override('components/login', 'Login');
// override('components/sidebar-resource-section', 'SidebarResourceSection');

/**
 * Common components
 */
export const SpotifyConnectionStatus = add('../components/spotify-connection-status', 'SpotifyConnectionStatus');
export const SpotifyTokenEdit = add('../components/spotify-connection-edit', 'SpotifyConnectionEdit');
export const FormattedDate = add('../components/formatted-date', 'FormattedDate');
export const CoinbaseConnectionStatus = add('../components/coinbase-connection-status', 'CoinbaseConnectionStatus');
export const Dashboard = add('../components/dashboard', 'Dashboard');
export const JSONViewerChangeLog = add('../components/json-viewer-change-logs', 'JSONViewerChangeLog');
export const ContestChangeLogs = add('../components/contest-change-logs', 'ContestChangeLogs');
// export const NotificationTemplateEdit = add('../components/notification-template-edit', 'NotificationTemplateEdit');
// export const NotificationTemplateShow = add('../components/notification-template-show', 'NotificationTemplateShow');
export const GenreSlotsEdit = add('../components/genre-slot-edit', 'GenreSlotsEdit');
export const GenreSlotsShow = add('../components/genre-slot-show', 'GenreSlotsShow');

/**
 * Pages
 */
// export const CUSTOM_PAGE = add('pages/custom-page', 'CustomPage');
// export const DESIGN_SYSTEM_PAGE = add('pages/design-system-examples/index', 'DesignSystemPage');
import { ComponentLoader } from "adminjs";
import path from "path";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
export const componentLoader = new ComponentLoader();

export const add = (url: string, componentName: string): string =>
  componentLoader.add(componentName, path.join(__dirname, url));

export const override = (url: string, componentName: any): string =>
  componentLoader.override(componentName, path.join(__dirname, url));

/**
 * Overridable components
 */
override("../components/top-bar", "TopBar");

/**
 * Common components
 */
export const SpotifyTokenExpiry = add(
  "../components/spotify-token-expiry",
  "SpotifyTokenExpiry"
);
export const SpotifyTokenEdit = add(
  "../components/spotify-connection-edit",
  "SpotifyConnectionEdit"
);
export const LogoutButton = add("../components/logout-button", "LogoutButton");

// export const override = (url: string, componentName: OverridableComponent): string =>
//   componentLoader.override(componentName, path.join(__dirname, url));

// /**
//  * Overridable components
//  */
// override('components/top-bar', 'Version');
// override('components/login', 'Login');
// override('components/sidebar-resource-section', 'SidebarResourceSection');

/**
 * Pages
 */
// export const CUSTOM_PAGE = add('pages/custom-page', 'CustomPage');
// export const DESIGN_SYSTEM_PAGE = add('pages/design-system-examples/index', 'DesignSystemPage');

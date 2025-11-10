import { App } from '../types/app';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export interface AppEventMetadata {
  screenshot_index?: number;
  destination?: string;
  from?: string;
  [key: string]: unknown;
}

/**
 * Track app-related events in Google Analytics
 */
export const trackAppEvent = (
  event: string,
  app: App,
  metadata?: AppEventMetadata
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'Apps',
      app_id: app.id,
      app_name: app.name,
      app_category: app.category,
      ...metadata
    });
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${event}`, {
      app: app.name,
      ...metadata
    });
  }
};

/**
 * Track app view events
 */
export const trackAppView = (app: App, from?: string) => {
  trackAppEvent('app_view', app, { from });
};

/**
 * Track app click events
 */
export const trackAppClick = (app: App, destination: string) => {
  trackAppEvent('app_click', app, { destination });
};

/**
 * Track screenshot interactions
 */
export const trackScreenshotView = (app: App, screenshotIndex: number) => {
  trackAppEvent('screenshot_view', app, { screenshot_index: screenshotIndex });
};

/**
 * Track app detail modal open
 */
export const trackAppDetailOpen = (app: App) => {
  trackAppEvent('app_detail_open', app);
};

/**
 * Track app detail modal close
 */
export const trackAppDetailClose = (app: App) => {
  trackAppEvent('app_detail_close', app);
};

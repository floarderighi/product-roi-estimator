/**
 * Simple analytics tracking
 * Based on PRD section 12: Analytics
 */

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: Date;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      // Load events from localStorage
      const stored = localStorage.getItem('analytics_events');
      if (stored) {
        try {
          this.events = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to load analytics events', e);
        }
      }
    }
  }

  /**
   * Track an event
   */
  track(event: string, properties?: Record<string, any>) {
    if (!this.enabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date(),
    };

    this.events.push(analyticsEvent);

    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('analytics_events', JSON.stringify(this.events));
    }

    // In production, this would send to an analytics service
    console.log('[Analytics]', event, properties);
  }

  /**
   * Track page view
   */
  page(name: string, properties?: Record<string, any>) {
    this.track('Page Viewed', { page: name, ...properties });
  }

  /**
   * Get all events
   */
  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  /**
   * Clear all events
   */
  clear() {
    this.events = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('analytics_events');
    }
  }

  /**
   * Enable/disable tracking
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

// Singleton instance
export const analytics = typeof window !== 'undefined' ? new Analytics() : null;

// Make available globally for easy access
if (typeof window !== 'undefined') {
  (window as any).analytics = analytics;
}

/**
 * Key events to track (from PRD):
 * - View landing → Start
 * - Start → Completed
 * - Completed → Share link
 * - Completed → Export
 * - Template chosen
 * - Time of completion
 * - Fields modified (drop-offs)
 */

export const trackLandingView = () => {
  analytics?.track('Landing Viewed');
};

export const trackFormStart = (businessModel: string) => {
  analytics?.track('Form Started', { businessModel });
};

export const trackFormCompleted = (data: {
  businessModel: string;
  completionTime: number;
  confidenceScore: number;
  payback: number;
}) => {
  analytics?.track('Form Completed', data);
};

export const trackReportShared = (reportId: string) => {
  analytics?.track('Report Shared', { reportId });
};

export const trackReportExported = (reportId: string) => {
  analytics?.track('Report Exported', { reportId });
};

export const trackReportViewed = (reportId: string) => {
  analytics?.track('Report Viewed', { reportId });
};

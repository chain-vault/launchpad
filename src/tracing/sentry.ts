// import { BrowserTracing } from '@sentry/browser';
import { router } from '@adapters/tanstack';
import * as Sentry from '@sentry/react';

export function setupSentry() {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    enabled: true,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.tanstackRouterBrowserTracingIntegration(router),
      Sentry.browserTracingIntegration(),
      Sentry.browserProfilingIntegration(),
      Sentry.replayIntegration(),
      // new BrowserTracing({
      //   startTransactionOnLocationChange: false,
      //   startTransactionOnPageLoad: true,
      // }),
    ],
    // results in 25% of transactions being profiled (0.5*0.5=0.25)
    profilesSampleRate: 1.0,
    release: import.meta.env.VITE_APP_VERSION,
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    // Set profilesSampleRate to 1.0 to profile every transaction.
    // Since profilesSampleRate is relative to tracesSampleRate,
    // the final profiling rate can be computed as tracesSampleRate * profilesSampleRate
    // For example, a tracesSampleRate of 0.5 and profilesSampleRate of 0.5 would
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [/^https:\/\/.*\.apeon\.it/],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
  });
}

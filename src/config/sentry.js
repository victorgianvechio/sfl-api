import { CaptureConsole as CaptureConsoleIntegration } from '@sentry/integrations';

export default {
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [
    new CaptureConsoleIntegration({
      // ['log', 'info', 'warn', 'error', 'debug', 'assert']
      levels: ['error', 'warn'],
    }),
  ],
};

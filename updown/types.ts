type ApdexThreshold = 0.125 | 0.25 | 0.5 | 1.0 | 2.0 | 4.0 | 8.0;

export type Check = {
  url: string;
  name: string;
  emailAlerts?: boolean;
  slackAlerts?: ('digital-general' | 'alerts-channel')[];
  apdexThreshold?: ApdexThreshold;
  disabled_locations: string[];
};

export type UpdownCheck = {
  token: string;
  url: string;
  alias: string;
  recipients: string[];
  apdex_t: ApdexThreshold;
};

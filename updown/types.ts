export type Check = {
  url: string;
  name: string;
  emailAlerts?: boolean;
  slackAlerts?: ('platform-channel' | 'alerts-channel')[];
};

export type UpdownCheck = {
  token: string;
  url: string;
  alias: string;
  recipients: string[];
};

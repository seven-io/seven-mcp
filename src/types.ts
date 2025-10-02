export interface SevenConfig {
  apiKey?: string;
  clientId?: string;
  baseUrl?: string;
}

export interface SMSParams {
  to: string | string[];
  text: string;
  from?: string;
  delay?: string;
  debug?: boolean;
  flash?: boolean;
  no_reload?: boolean;
  unicode?: boolean;
  utf8?: boolean;
  details?: boolean;
  return_msg_id?: boolean;
  performance_tracking?: boolean;
  label?: string;
  foreign_id?: string;
  ttl?: number;
}

export interface RCSParams {
  to: string;
  text?: string;
  media?: string;
  suggestions?: Array<{ text: string; action: string }>;
  orientation?: 'horizontal' | 'vertical';
  from?: string;
  foreign_id?: string;
}

export interface VoiceParams {
  to: string | string[];
  text: string;
  from?: string;
  xml?: boolean;
  debug?: boolean;
}

export interface LookupParams {
  number: string;
}

export interface ContactParams {
  nick?: string;
  empfaenger?: string;
  email?: string;
  groups?: string[];
}

export interface GroupParams {
  name: string;
}

export interface SubaccountParams {
  username?: string;
  password?: string;
  email?: string;
  auto_recharge?: boolean;
}

export interface WebhookParams {
  target_url: string;
  event_type: string;
  request_method?: 'GET' | 'POST';
}

export interface NumberParams {
  country?: string;
  type?: string;
}

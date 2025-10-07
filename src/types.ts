export interface SevenConfig {
  apiKey?: string;
  clientId?: string;
  baseUrl?: string;
}

export interface SMSFileAttachment {
  name: string;
  contents: string;
  validity?: number;
  password?: string;
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
  udh?: string;
  is_binary?: boolean;
  files?: SMSFileAttachment[];
}

export interface RCSParams {
  to: string;
  text?: string;
  media?: string;
  suggestions?: Array<{ text: string; action: string }>;
  orientation?: 'horizontal' | 'vertical';
  from?: string;
  foreign_id?: string;
  delay?: string;
  ttl?: number;
  label?: string;
  performance_tracking?: boolean;
}

export interface VoiceParams {
  to: string | string[];
  text: string;
  from?: string;
  xml?: boolean;
  debug?: boolean;
  ringtime?: number;
  foreign_id?: string;
}

export interface LookupParams {
  number: string;
}

export interface ContactParams {
  firstname?: string;
  lastname?: string;
  mobile_number?: string;
  home_number?: string;
  email?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  birthday?: string;
  notes?: string;
  avatar?: string;
  groups?: string[];
}

export interface GroupParams {
  name: string;
}

export interface SubaccountParams {
  name?: string;
  email?: string;
  threshold?: number;
  amount?: number;
}

export interface WebhookParams {
  target_url: string;
  event_type: string;
  request_method?: 'GET' | 'POST' | 'JSON';
  event_filter?: string;
  headers?: string;
}

export interface NumberParams {
  country?: string;
  type?: string;
  features_sms?: boolean;
  features_a2p_sms?: boolean;
  features_voice?: boolean;
}

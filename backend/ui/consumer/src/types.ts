export type User = {
  user_id: string;
  emails: {
    email: string;
    email_id: string;
    verified: boolean;
  }[];
  status: "active" | "pending" | "suspended";
  name: {
    first_name: string;
    last_name: string;
  };
  phone_numbers: {
    phone_number: string;
    phone_id: string;
    verified: boolean;
  }[];
  webauthn_registrations: {
    webauthn_registration_id: string;
    domain: string;
    user_agent: string;
    verified: boolean;
    name: string;
  }[];
  crypto_wallets: {
    crypto_wallet_id: string;
    crypto_wallet_address: string;
    crypto_wallet_type: string;
    verified: boolean;
  }[];
  totp_registrations: {
    totp_registration_id: string;
    verified: boolean;
  }[];
  backup_codes: {
    backup_code_id: string;
    codes: string[];
  }[];
  password: {
    password_id: string;
    requires_reset: boolean;
  };
  oauth_registrations: {
    provider_type: string;
    provider_subject: string;
    profile_picture_url: string;
    locale: string;
    oauth_user_registration_id: string;
  }[];
  sso_registrations: {
    connection_id: string;
    external_id: string;
    registration_id: string;
    sso_attributes: Record<string, string[]>;
  }[];
  biometric_registrations: {
    biometric_registration_id: string;
    verified: boolean;
  }[];
  created_at: string;
  updated_at: string;
};

export type Session = {
  session_id: string;
  user_id: string;
  started_at: string;
  last_accessed_at: string;
  expires_at: string;
  attributes: Record<string, unknown>;
  authentication_factors: {
    type:
      | "email_otp"
      | "magic_link"
      | "oauth"
      | "otp"
      | "password"
      | "recovery_codes"
      | "sso"
      | "totp"
      | "webauthn";
    delivery_method: string;
    created_at: string;
    last_authenticated_at: string;
    updated_at: string;
    email_factor: {
      email_address: string;
      email_id: string;
    };
    phone_number_factor: {
      phone_number: string;
      phone_id: string;
    };
    google_oauth_factor: {
      id: string;
      email_id: string;
      provider_subject: string;
    };
    microsoft_oauth_factor: {
      id: string;
      email_id: string;
      provider_subject: string;
    };
    webauthn_factor: {
      webauthn_registration_id: string;
      domain: string;
      user_agent: string;
    };
    authenticator_app_factor: {
      totp_id: string;
    };
  }[];
  custom_claims: Record<string, unknown>;
};

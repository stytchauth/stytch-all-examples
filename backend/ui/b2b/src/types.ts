export type Organization = {
  organization_id: string;
  organization_name: string;
  organization_logo_url: string;
  organization_slug: string;
  organization_external_id: string;
  sso_jit_provisioning: "ALL_ALLOWED" | "RESTRICTED" | "NOT_ALLOWED";
  sso_jit_provisioning_allowed_connections: string[];
  sso_active_connections: {
    connection_id: string;
    display_name: string;
  }[];
  scim_active_connection: {
    connection_id: string;
    display_name: string;
  };
  email_allowed_domains: string[];
  email_jit_provisioning: "RESTRICTED" | "NOT_ALLOWED";
  email_invites: "ALL_ALLOWED" | "RESTRICTED" | "NOT_ALLOWED";
  authMethods: "ALL_ALLOWED" | "RESTRICTED";
  allowed_auth_methods: string[];
  mfa_methods: "ALL_ALLOWED" | "RESTRICTED";
  allowed_mfa_methods: string[];
  trusted_metadata: Record<string, unknown>;
  sso_default_connection_id: string;
  rbac_email_implicit_role_assignments: {
    domain: string;
    role_id: string;
  }[];
  oauth_tenant_jit_provisioning: "RESTRICTED" | "NOT_ALLOWED";
  allowed_oauth_tenants: Record<"slack" | "hubspot" | "github", string[]>;
  first_party_connected_apps_allowed_type:
    | "ALL_ALLOWED"
    | "RESTRICTED"
    | "NOT_ALLOWED";
  allowed_first_party_connected_apps: string[];
  third_party_connected_apps_allowed_type:
    | "ALL_ALLOWED"
    | "RESTRICTED"
    | "NOT_ALLOWED";
  allowed_third_party_connected_apps: string[];
  created_at: string;
  updated_at: string;
};

export type Member = {
  organization_id: string;
  member_id: string;
  external_id: string;
  email_address: string;
  email_address_verified: boolean;
  status: "pending" | "invited" | "active" | "deleted";
  name: string;
  sso_registrations: {
    connection_id: string;
    registration_id: string;
    external_id: string;
    sso_attributes: Record<string, string[]>;
  }[];
  scim_registration: {
    connection_id: string;
    registration_id: string;
    external_id: string;
    scim_attributes: Record<string, unknown>;
  };
  is_breakglass: boolean;
  member_password_id: string;
  oauth_registrations: {
    provider_type: string;
    provider_subject: string;
    profile_picture_url: string;
    locale: string;
    member_oauth_registration_id: string;
  }[];
  mfa_enrolled: boolean;
  mfa_phone_number: string;
  mfa_phone_number_verified: boolean;
  retired_email_addresses: {
    email_id: string;
    email_address: string;
  }[];
  trusted_metadata: Record<string, unknown>;
  untrusted_metadata: Record<string, unknown>;
  roles: {
    role_id: string;
    sources: {
      type:
        | "direct_assignment"
        | "email_assignment"
        | "sso_connection"
        | "sso_connection_group"
        | "scim_connection_group";
      details: Record<string, string>;
    }[];
  }[];
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type MFARequired = {
  secondary_auth_initiated: boolean;
  member_options: {
    mfa_phone_number: string;
    totp_registration_id: string;
  };
};

export type PrimaryRequired = {
  allowed_auth_methods: string[];
};

export type DiscoveredOrganization = {
  organization: Organization;
  membership: {
    type:
      | "active_member"
      | "pending_member"
      | "invited_member"
      | "eligible_to_join_by_email_domain"
      | "eligible_to_join_by_oauth_tenant";
    member: Member;
    details: Record<string, unknown>;
  };
  member_authenticated: boolean;
  mfa_required: MFARequired;
  primary_required: PrimaryRequired;
};

export type Session = {
  member_session_id: string;
  member_id: string;
  started_at: string;
  last_accessed_at: string;
  expires_at: string;
  authentication_factors: {
    type:
      | "email_otp"
      | "impersonated"
      | "imported"
      | "magic_link"
      | "oauth"
      | "otp"
      | "password"
      | "recovery_codes"
      | "sso"
      | "trusted_auth_token"
      | "totp";
    delivery_method: string;
    created_at: string;
    last_authenticated_at: string;
    updated_at: string;
    sequence_order: "PRIMARY" | "SECONDARY";
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
    slack_oauth_factor: {};
    hubspot_oauth_factor: {
      id: string;
      email_id: string;
      provider_subject: string;
    };
    github_oauth_factor: {
      id: string;
      email_id: string;
      provider_subject: string;
    };
    hubspot_oauth_exchange_factor: {
      email_id: string;
    };
    github_oauth_exchange_factor: {
      email_id: string;
    };
    slack_oauth_exchange_factor: {
      email_id: string;
    };
    microsoft_oauth_exchange_factor: {
      email_id: string;
    };
    google_oauth_exchange_factor: {
      email_id: string;
    };
    saml_sso_factor: {
      id: string;
      provider_id: string;
      external_id: string;
    };
    oidc_sso_factor: {
      id: string;
      provider_id: string;
      external_id: string;
    };
    authenticator_app_factor: {
      totp_id: string;
    };
    impersonated_factor: {
      impersonator_email_address: string;
      impersonator_id: string;
    };
    trusted_auth_token_factor: {
      token_id: string;
    };
    oauth_access_token_exchange_factor: {
      client_id: string;
    };
  }[];
  custom_claims: Record<string, unknown>;
  organization_id: string;
  organization_slug: string;
  roles: string[];
};

export type MemberDevice = {
  visitor_id: string;
  visitor_id_details: {
    is_new: boolean;
    first_seen_at: string;
    last_seen_at: string;
  };
  ip_address: string;
  ip_address_details: {
    is_new: boolean;
    first_seen_at: string;
    last_seen_at: string;
  };
  ip_geo_country: string;
  ip_geo_country_details: {
    is_new: boolean;
    first_seen_at: string;
    last_seen_at: string;
  };
  ip_geo_city: string;
  ip_geo_region: string;
};

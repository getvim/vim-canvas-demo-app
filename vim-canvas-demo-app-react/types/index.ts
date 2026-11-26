export interface Settings {
  id?: string;
  organization_id?: string;
  theme_color: string;
  adapter_actions_enabled?: boolean;
}

export interface PublicOrganizationSettings {
  enabled: boolean;
  themeColor: string | null;
}

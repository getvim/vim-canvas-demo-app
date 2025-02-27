import { useEffect, useState } from "react";
import { useVimSettingsSdkContext } from "./useVimSettingsSdkContext";
import { jwtDecode } from "jwt-decode";

const ORGANIZATION_ID_CLAIM = "https://getvim.com/organizationId";

export const useOrganizationContext = () => {
  const [organizationId, setOrganizationId] = useState<string>("");
  const vimSettingsSDk = useVimSettingsSdkContext();

  useEffect(() => {
    const idToken = vimSettingsSDk.getIdToken();
    const decodedToken = jwtDecode<{ [key: string]: string }>(idToken);
    const organizationId = decodedToken?.[ORGANIZATION_ID_CLAIM];
    setOrganizationId(organizationId);
  }, [vimSettingsSDk]);

  return organizationId;
};

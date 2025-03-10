import type { SDK } from "vim-os-js-browser/types";

export function buildName(vimOS: SDK): string | null {
  const firstName = vimOS.ehr.ehrState?.patient?.demographics?.firstName;
  const lastName = vimOS.ehr.ehrState?.patient?.demographics?.lastName;
  if (!firstName && !lastName) {
    return null;
  }

  const name = `${lastName} ${firstName}`;

  return name;
}

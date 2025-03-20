import { Injectable, signal } from "@angular/core";
import { BehaviorSubject, map, Observable, of, Subject, tap } from "rxjs";
import { loadSdk } from "vim-os-js-browser";
import { EHR, SDK } from "vim-os-js-browser/types";

@Injectable({
  providedIn: "root",
})
export class VimOsService {
  vimSdk: SDK | undefined;

  patient = signal<EHR.Patient | undefined>(undefined);

  encounter = signal<EHR.Encounter | undefined>(undefined);


  isAppOpen: boolean = false;
  constructor() {
    this.loadVimOs();
  }


  get user() {
    return of(this.vimSdk?.sessionContext.user);
  }

  vimSdkLoaded(): Observable<boolean> {
    return of(!!this.vimSdk);
  }

  private subscribeToData(sdk: SDK): void {
    sdk.ehr.subscribe("patient", (patient) => {
      this.patient.update(() => patient);
    });
    sdk.ehr.subscribe("encounter", (encounter) => {
      this.encounter.update(() => encounter);
    });

    sdk.hub.appState.subscribe("isAppOpen", (isOpen) => {
      this.isAppOpen = !!isOpen;
      if (isOpen) {
        this.vimSdk?.hub.notificationBadge.hide();
      }
    });
  }

  enableApp() {
    this.vimSdk?.hub.setActivationStatus("ENABLED");
  }

  disableApp() {
    this.vimSdk?.hub.setActivationStatus("DISABLED");
  }

  showPopup() {
    this.vimSdk?.hub.autoPopup();
  }

  showBadge(count: number = 0) {
    if (this.isAppOpen) return;
    this.vimSdk?.hub.notificationBadge.set(count);
  }
  async loadVimOs() {
    const sdk = await loadSdk();
    this.vimSdk = sdk;
    sdk.hub.setActivationStatus("ENABLED");
    this.subscribeToData(sdk);
  }
}

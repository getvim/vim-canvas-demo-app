import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, Subject, tap } from 'rxjs';
import {loadSdk} from 'vim-os-js-browser'
import { EHR, SDK } from 'vim-os-js-browser/types';

@Injectable({
  providedIn: 'root'
})
export class VimOsService {
  
  vimSdk: SDK | undefined;

  _patient: BehaviorSubject<EHR.Patient | undefined> = new BehaviorSubject<EHR.Patient | undefined>(undefined);

  _encounter: BehaviorSubject<EHR.Encounter | undefined> = new BehaviorSubject<EHR.Encounter | undefined>(undefined);

  isAppOpen: boolean = false;
  constructor() { 

  }

  get patient(): Observable<EHR.Patient | undefined> {
    return this._patient
  }

  get user() {
    return of(this.vimSdk?.sessionContext.user)
  }

  vimSdkLoaded(): Observable<boolean> {
    return of(!!this.vimSdk)
  }

  private subscribeToData(sdk: SDK): void {
    sdk.ehr.subscribe('patient', (patient) => {
      this._patient.next(patient)
  })
    sdk.ehr.subscribe('encounter', (encounter) => {
      this._encounter.next(encounter)
    })

    sdk.hub.appState.subscribe('isAppOpen', (isOpen) => {
      this.isAppOpen = !!isOpen
      if(isOpen) { 
        this.vimSdk?.hub.notificationBadge.hide()

      }
    })
  }




  enableApp() {
    this.vimSdk?.hub.setActivationStatus("ENABLED")
  }
  
  disableApp() {
    this.vimSdk?.hub.setActivationStatus("DISABLED")
  }

  showPopup() {
    this.vimSdk?.hub.autoPopup()
  }

  showBadge(count: number = 0 ) {
    if(this.isAppOpen)  return;
    this.vimSdk?.hub.notificationBadge.set(count)
  }
  loadVimOs() {
      loadSdk().then((sdk) => {
        this.vimSdk = sdk
        console.log('vim sdk loaded')
        sdk.hub.setActivationStatus("ENABLED")
        this.subscribeToData(sdk)
      });
  }
}

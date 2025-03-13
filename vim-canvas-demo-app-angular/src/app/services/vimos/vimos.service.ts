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
  loadVimOs() {
      loadSdk().then((sdk) => {
        this.vimSdk = sdk
        console.log('vim sdk loaded')
        sdk.hub.setActivationStatus("ENABLED")
        this.subscribeToData(sdk)
      });
  }
}

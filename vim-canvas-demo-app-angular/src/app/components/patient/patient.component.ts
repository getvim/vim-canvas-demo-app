import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { VimOsService } from '../../services/vimos/vimos.service';
import {  Observable, Subject, takeUntil, tap } from 'rxjs';
import { EHR } from 'vim-os-js-browser/types';
import { AccordionComponent } from "../accordion/accordion.component";

@Component({
  selector: 'app-patient',
  imports: [
    CommonModule,
    AccordionComponent
],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<any>();

  constructor(private vimOsService: VimOsService) { 

  }

  ngOnInit(): void {
    this.vimOsService.patient.pipe(
      tap(patient => {
        if(patient) {
          this.vimOsService.vimSdk?.hub.pushNotification.show({
            notificationId:`patient-${patient?.identifiers.ehrPatientId}`,
            text: 'Patient loaded',
          
          })
        }
      }),
      takeUntil(this.destroy$)
    )
    .subscribe()
  }

  get patient(): Observable<EHR.Patient | undefined> {
    return this.vimOsService.patient.pipe(
      tap((patient) => {
        if(patient) {
            this.vimOsService.showBadge()
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}

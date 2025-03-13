import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { VimOsService } from '../../services/vimos/vimos.service';
import { map, Observable, tap } from 'rxjs';
import { EHR } from 'vim-os-js-browser/types';

@Component({
  selector: 'app-patient',
  imports: [
    CommonModule
  ],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientComponent {
  constructor(private vimOsService: VimOsService, private cd: ChangeDetectorRef) { 

  }

  get patient(): Observable<EHR.Patient | undefined> {
    return this.vimOsService.patient.pipe(
      tap((patient) => {
        if(patient) {
            this.vimOsService.showPopup()
        }
      })
    )
  }
}

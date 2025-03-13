import { Component } from '@angular/core';
import { VimOsService } from '../../services/vimos/vimos.service';
import { map, Observable, tap } from 'rxjs';
import {EHR, SDK} from 'vim-os-js-browser/types'
import { CommonModule } from '@angular/common';
import { PatientComponent } from "../patient/patient.component";
@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    PatientComponent
],
    templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {


  
}

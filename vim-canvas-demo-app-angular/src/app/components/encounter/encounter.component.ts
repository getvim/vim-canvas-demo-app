import { Component, forwardRef } from "@angular/core";
import { AccordionComponent } from "../accordion/accordion.component";
import { CommonModule } from "@angular/common";
import { VimOsService } from "../../services/vimos/vimos.service";
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: "app-encounter",
  imports: [AccordionComponent, CommonModule, ReactiveFormsModule],
  templateUrl: "./encounter.component.html",
  styleUrl: "./encounter.component.scss",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EncounterComponent),
      multi: true,
    }
  ]
})
export class EncounterComponent {
  encounterForm!: FormGroup;

  constructor(private vimOsService: VimOsService, private fb: FormBuilder) {
    this.encounterForm = this.fb.group({
      subjective: this.fb.group({
        chiefComplaintNotes: undefined,
        historyOfPresentIllnessNotes: undefined,
        reviewOfSystemsNotes: undefined,
        generalNotes: undefined,
      })
    })
  }

  get encounter() {
    return this.vimOsService._encounter;
  }

  subjectivePermissions() {
    
    return !this.vimOsService.vimSdk?.ehr.resourceUpdater.canUpdateEncounter({
      subjective: {
        chiefComplaintNotes: true,
        historyOfPresentIllnessNotes: true,
        reviewOfSystemsNotes: true,
        generalNotes: true,
      },
    }).canUpdate;
  }


  submitSubjectiveEncounter() {
    // if(!this.subjectivePermissions()) return;
    console.log(this.encounterForm.value)
    this.vimOsService.vimSdk?.ehr.resourceUpdater.updateEncounter({
      ...this.encounterForm.value,
    })

  }
}

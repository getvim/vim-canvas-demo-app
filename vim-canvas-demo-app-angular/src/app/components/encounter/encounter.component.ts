import { Component } from "@angular/core";
import { AccordionComponent } from "../accordion/accordion.component";
import { CommonModule } from "@angular/common";
import { VimOsService } from "../../services/vimos/vimos.service";

@Component({
  selector: "app-encounter",
  imports: [AccordionComponent, CommonModule],
  templateUrl: "./encounter.component.html",
  styleUrl: "./encounter.component.scss",
})
export class EncounterComponent {
  constructor(private vimOsService: VimOsService) {}

  get encounter() {
    console.log(this.subjectivePermissions());
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
}

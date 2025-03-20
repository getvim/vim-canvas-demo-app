import { CommonModule } from "@angular/common";
import { Component, effect, inject } from "@angular/core";
import { VimOsService } from "../../services/vimos/vimos.service";
import { AccordionComponent } from "../accordion/accordion.component";

@Component({
  selector: "app-patient",
  imports: [CommonModule, AccordionComponent],
  templateUrl: "./patient.component.html",
  styleUrl: "./patient.component.scss",
})
export class PatientComponent {
  vimOsService = inject(VimOsService);

  constructor() {
    effect(() => {
      const patient = this.vimOsService.patient();
      if (patient) {
        this.vimOsService.vimSdk?.hub.pushNotification.show({
          notificationId: `patient-${patient?.identifiers.ehrPatientId}`,
          text: "Patient loaded",
        });
        this.vimOsService.showBadge();
      }
    });
  }
}

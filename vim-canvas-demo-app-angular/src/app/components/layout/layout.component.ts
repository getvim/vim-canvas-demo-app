import { Component, inject } from "@angular/core";
import { VimOsService } from "../../services/vimos/vimos.service";
import { Hub } from "vim-os-js-browser/types";
import { CommonModule } from "@angular/common";
import { PatientComponent } from "../patient/patient.component";
import { FullLayoutIconComponent } from "./icons/full-layout-icon/full-layout-icon.component";
import { HalfFullLayoutIconComponent } from "./icons/half-full-layout-icon/half-full-layout-icon.component";
import { SmallFullLayoutIconComponent } from "./icons/small-full-layout-icon/small-full-layout-icon.component";
import { UserComponent } from "../user/user.component";
import { EncounterComponent } from "../encounter/encounter.component";
@Component({
  selector: "app-layout",
  imports: [
    CommonModule,
    PatientComponent,
    FullLayoutIconComponent,
    HalfFullLayoutIconComponent,
    SmallFullLayoutIconComponent,
    UserComponent,
    EncounterComponent,
  ],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.scss",
})
export class LayoutComponent {
  vimOsService = inject(VimOsService);

  constructor() {}
  onToggleSize(size: Hub.ApplicationSize) {
    this.vimOsService.vimSdk?.hub.setDynamicAppSize(size);
  }
}

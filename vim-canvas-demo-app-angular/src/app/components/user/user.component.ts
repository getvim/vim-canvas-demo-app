import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { VimOsService } from "../../services/vimos/vimos.service";
import { AccordionComponent } from "../accordion/accordion.component";

@Component({
  selector: "app-user",
  imports: [CommonModule, AccordionComponent],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.scss",
})
export class UserComponent {
  vimOsService = inject(VimOsService);

  constructor() {}
  isAccordionOpen = false;
  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-accordion',
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss'
})
export class AccordionComponent {
  @Input('title') title: string = '';
  isAccordionOpen = false;
  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }
}

import {
  Component,
  effect,
  forwardRef,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { AccordionComponent } from "../accordion/accordion.component";
import { CommonModule } from "@angular/common";
import { VimOsService } from "../../services/vimos/vimos.service";
import {
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { Subject, takeUntil, tap } from "rxjs";

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
    },
  ],
})
export class EncounterComponent implements OnInit, OnDestroy {
  vimOsService = inject(VimOsService);
  fb = inject(FormBuilder);
  encounterForm!: FormGroup;
  
  classes =
    "text-slate-600 bg-white border border-slate-300 appearance-none rounded-lg px-3.5 py-2.5 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
  private readonly destroy$ = new Subject<any>();

  constructor() {
    this.encounterForm = this.fb.group({
      subjective: this.fb.group({
        chiefComplaintNotes: undefined,
        historyOfPresentIllnessNotes: undefined,
        reviewOfSystemsNotes: undefined,
        generalNotes: undefined,
      }),
    });

    this.updateFormFromSdkOnChange();
    
  }
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }


  updateFormFromSdkOnChange() {
    effect(() => {
      if(this.vimOsService.encounter()) {
        const encounter = this.vimOsService.encounter();
        this.encounterForm.patchValue({
          subjective: {
            chiefComplaintNotes: encounter?.subjective?.chiefComplaintNotes,
            historyOfPresentIllnessNotes: encounter?.subjective?.historyOfPresentIllnessNotes,
            reviewOfSystemsNotes: encounter?.subjective?.reviewOfSystemsNotes,
            generalNotes: encounter?.subjective?.generalNotes,
          },
        });
      }
    })
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
    console.log(this.encounterForm.value);
    this.vimOsService.vimSdk?.ehr.resourceUpdater.updateEncounter({
      ...this.encounterForm.value,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}

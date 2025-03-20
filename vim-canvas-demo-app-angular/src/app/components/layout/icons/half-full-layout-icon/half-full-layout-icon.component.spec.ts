import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalfFullLayoutIconComponent } from './half-full-layout-icon.component';

describe('HalfFullLayoutIconComponent', () => {
  let component: HalfFullLayoutIconComponent;
  let fixture: ComponentFixture<HalfFullLayoutIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HalfFullLayoutIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HalfFullLayoutIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

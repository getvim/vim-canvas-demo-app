import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullLayoutIconComponent } from './full-layout-icon.component';

describe('FullLayoutIconComponent', () => {
  let component: FullLayoutIconComponent;
  let fixture: ComponentFixture<FullLayoutIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullLayoutIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullLayoutIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

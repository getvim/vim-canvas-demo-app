import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallFullLayoutIconComponent } from './small-full-layout-icon.component';

describe('SmallFullLayoutIconComponent', () => {
  let component: SmallFullLayoutIconComponent;
  let fixture: ComponentFixture<SmallFullLayoutIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallFullLayoutIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmallFullLayoutIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

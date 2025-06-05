import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftmanagementComponent } from './shiftmanagement.component';

describe('ShiftmanagementComponent', () => {
  let component: ShiftmanagementComponent;
  let fixture: ComponentFixture<ShiftmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftmanagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerLeaveComponent } from './manager-leave.component';

describe('ManagerLeaveComponent', () => {
  let component: ManagerLeaveComponent;
  let fixture: ComponentFixture<ManagerLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerLeaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

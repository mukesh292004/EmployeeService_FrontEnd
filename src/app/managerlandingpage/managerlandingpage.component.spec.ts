import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerlandingpageComponent } from './managerlandingpage.component';

describe('ManagerlandingpageComponent', () => {
  let component: ManagerlandingpageComponent;
  let fixture: ComponentFixture<ManagerlandingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerlandingpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerlandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

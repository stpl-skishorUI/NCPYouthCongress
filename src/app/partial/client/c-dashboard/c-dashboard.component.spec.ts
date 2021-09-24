import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CDashboardComponent } from './c-dashboard.component';

describe('CDashboardComponent', () => {
  let component: CDashboardComponent;
  let fixture: ComponentFixture<CDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

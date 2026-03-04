import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsFilterMobileComponent } from './rooms-filter-mobile.component';

describe('RoomsFilterMobileComponent', () => {
  let component: RoomsFilterMobileComponent;
  let fixture: ComponentFixture<RoomsFilterMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoomsFilterMobileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomsFilterMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

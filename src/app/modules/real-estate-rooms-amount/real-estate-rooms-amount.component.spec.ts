import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateRoomsAmountComponent } from './real-estate-rooms-amount.component';

describe('RealEstateRoomsAmountComponent', () => {
  let component: RealEstateRoomsAmountComponent;
  let fixture: ComponentFixture<RealEstateRoomsAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RealEstateRoomsAmountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealEstateRoomsAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

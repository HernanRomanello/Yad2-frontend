import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstatePriceSliderComponent } from './real-estate-price-slider.component';

describe('RealEstatePriceSliderComponent', () => {
  let component: RealEstatePriceSliderComponent;
  let fixture: ComponentFixture<RealEstatePriceSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RealEstatePriceSliderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealEstatePriceSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

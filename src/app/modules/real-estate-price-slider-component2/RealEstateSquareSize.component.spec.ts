import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstatePriceSliderComponent2Component } from './real-estate-price-slider-component2.component';

describe('RealEstatePriceSliderComponent2Component', () => {
  let component: RealEstatePriceSliderComponent2Component;
  let fixture: ComponentFixture<RealEstatePriceSliderComponent2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RealEstatePriceSliderComponent2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealEstatePriceSliderComponent2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

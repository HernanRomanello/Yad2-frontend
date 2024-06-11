import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateAdditionalFiltersComponent } from './real-estate-additional-filters.component';

describe('RealEstateAdditionalFiltersComponent', () => {
  let component: RealEstateAdditionalFiltersComponent;
  let fixture: ComponentFixture<RealEstateAdditionalFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RealEstateAdditionalFiltersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealEstateAdditionalFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

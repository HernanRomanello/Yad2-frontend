import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstatePropertyTypeComponent } from './real-estate-property-type.component';

describe('RealEstatePropertyTypeComponent', () => {
  let component: RealEstatePropertyTypeComponent;
  let fixture: ComponentFixture<RealEstatePropertyTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RealEstatePropertyTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealEstatePropertyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

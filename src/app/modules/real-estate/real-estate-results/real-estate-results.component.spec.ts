import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateResultsComponent } from './real-estate-results.component';

describe('RealEstateResultsComponent', () => {
  let component: RealEstateResultsComponent;
  let fixture: ComponentFixture<RealEstateResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RealEstateResultsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealEstateResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

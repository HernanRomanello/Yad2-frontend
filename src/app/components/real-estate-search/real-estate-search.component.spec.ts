import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateSearchComponent } from './real-estate-search.component';

describe('RealEstateSearchComponent', () => {
  let component: RealEstateSearchComponent;
  let fixture: ComponentFixture<RealEstateSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RealEstateSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealEstateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

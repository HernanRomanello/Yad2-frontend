import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileSearchHeaderComponent } from './mobile-search-header.component';

describe('MobileSearchHeaderComponent', () => {
  let component: MobileSearchHeaderComponent;
  let fixture: ComponentFixture<MobileSearchHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MobileSearchHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileSearchHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

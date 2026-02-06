import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdPromotionComponent } from './ad-promotion.component';

describe('AdPromotionComponent', () => {
  let component: AdPromotionComponent;
  let fixture: ComponentFixture<AdPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdPromotionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

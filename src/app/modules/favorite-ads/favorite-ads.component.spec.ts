import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteAdsComponent } from './favorite-ads.component';

describe('FavoriteAdsComponent', () => {
  let component: FavoriteAdsComponent;
  let fixture: ComponentFixture<FavoriteAdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavoriteAdsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FavoriteAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

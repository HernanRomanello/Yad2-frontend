import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteAdvertisementsComponent } from './favorite-advertisements.component';

describe('FavoriteAdvertisementsComponent', () => {
  let component: FavoriteAdvertisementsComponent;
  let fixture: ComponentFixture<FavoriteAdvertisementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavoriteAdvertisementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FavoriteAdvertisementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdvertisementComponent } from './user-advertisement.component';

describe('UserAdvertisementComponent', () => {
  let component: UserAdvertisementComponent;
  let fixture: ComponentFixture<UserAdvertisementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAdvertisementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserAdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

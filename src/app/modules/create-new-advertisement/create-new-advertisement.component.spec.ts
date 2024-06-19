import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewAdvertisementComponent } from './create-new-advertisement.component';

describe('CreateNewAdvertisementComponent', () => {
  let component: CreateNewAdvertisementComponent;
  let fixture: ComponentFixture<CreateNewAdvertisementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateNewAdvertisementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateNewAdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipsInformationComponent } from './tips-information.component';

describe('TipsInformationComponent', () => {
  let component: TipsInformationComponent;
  let fixture: ComponentFixture<TipsInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TipsInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipsInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

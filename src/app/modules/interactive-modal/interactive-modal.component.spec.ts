import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveModalComponent } from './interactive-modal.component';

describe('InteractiveModalComponent', () => {
  let component: InteractiveModalComponent;
  let fixture: ComponentFixture<InteractiveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InteractiveModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InteractiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

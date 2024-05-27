import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealeStateComponent } from './reale-state.component';

describe('RealeStateComponent', () => {
  let component: RealeStateComponent;
  let fixture: ComponentFixture<RealeStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RealeStateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealeStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSearchQueryBoxComponent } from './sub-search-query-box.component';

describe('SubSearchQueryBoxComponent', () => {
  let component: SubSearchQueryBoxComponent;
  let fixture: ComponentFixture<SubSearchQueryBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubSearchQueryBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubSearchQueryBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

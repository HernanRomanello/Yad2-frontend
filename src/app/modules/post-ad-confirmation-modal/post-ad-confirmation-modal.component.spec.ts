import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostAdConfirmationModalComponent } from './post-ad-confirmation-modal.component';

describe('PostAdConfirmationModalComponent', () => {
  let component: PostAdConfirmationModalComponent;
  let fixture: ComponentFixture<PostAdConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostAdConfirmationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostAdConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

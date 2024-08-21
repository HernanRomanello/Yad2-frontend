import { TestBed } from '@angular/core/testing';

import { InputsStyleService } from './inputs-style.service';

describe('InputsStyleService', () => {
  let service: InputsStyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputsStyleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

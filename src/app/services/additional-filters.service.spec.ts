import { TestBed } from '@angular/core/testing';

import { AdditionalFiltersService } from './additional-filters.service';

describe('AdditionalFiltersService', () => {
  let service: AdditionalFiltersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdditionalFiltersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

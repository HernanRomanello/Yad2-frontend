import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { favoritesAdResolver } from './favorites-ad.resolver';

describe('favoritesAdResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => favoritesAdResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { RaComponentService } from './ra-component.service';

describe('RaComponentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RaComponentService = TestBed.get(RaComponentService);
    expect(service).toBeTruthy();
  });
});

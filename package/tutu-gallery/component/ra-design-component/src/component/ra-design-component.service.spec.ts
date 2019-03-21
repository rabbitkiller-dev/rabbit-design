import { TestBed } from '@angular/core/testing';

import { RaDesignComponentService } from './ra-design-component.service';

describe('RaDesignComponentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RaDesignComponentService = TestBed.get(RaDesignComponentService);
    expect(service).toBeTruthy();
  });
});

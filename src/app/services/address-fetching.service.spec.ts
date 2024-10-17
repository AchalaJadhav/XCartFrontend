import { TestBed } from '@angular/core/testing';

import { AddressFetchingService } from './address-fetching.service';

describe('AddressFetchingService', () => {
  let service: AddressFetchingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddressFetchingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

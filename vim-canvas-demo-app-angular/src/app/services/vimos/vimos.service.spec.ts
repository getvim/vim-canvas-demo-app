import { TestBed } from '@angular/core/testing';

import { VimosService } from './vimos.service';

describe('VimosService', () => {
  let service: VimosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VimosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

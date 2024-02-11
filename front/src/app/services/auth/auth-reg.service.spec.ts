import { TestBed } from '@angular/core/testing';

import { AuthRegService } from './auth-reg.service';

describe('AuthRegService', () => {
  let service: AuthRegService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthRegService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

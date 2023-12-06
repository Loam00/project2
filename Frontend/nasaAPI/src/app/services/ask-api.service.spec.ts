import { TestBed } from '@angular/core/testing';

import { AskAPIService } from './ask-api.service';

describe('AskAPIService', () => {
  let service: AskAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AskAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

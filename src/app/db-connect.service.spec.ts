import { TestBed } from '@angular/core/testing';

import { DbConnectService } from './db-connect.service';

describe('DbConnectService', () => {
  let service: DbConnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbConnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

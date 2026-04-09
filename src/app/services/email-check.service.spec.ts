import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EmailCheckService } from './email-check.service';

describe('EmailCheckService', () => {
  let service: EmailCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailCheckService);
  });

  it('returns true for a taken email', fakeAsync(() => {
    let result: boolean | undefined;
    service.checkEmailExists('test@example.com').subscribe(v => (result = v));
    tick(800);
    expect(result).toBe(true);
  }));

  it('returns true for all seeded taken emails', fakeAsync(() => {
    const takenEmails = ['test@example.com', 'john@doe.com', 'jane@doe.com'];
    takenEmails.forEach(email => {
      let result: boolean | undefined;
      service.checkEmailExists(email).subscribe(v => (result = v));
      tick(800);
      expect(result).withContext(email).toBe(true);
    });
  }));

  it('returns false for an available email', fakeAsync(() => {
    let result: boolean | undefined;
    service.checkEmailExists('available@example.com').subscribe(v => (result = v));
    tick(800);
    expect(result).toBe(false);
  }));

  it('returns false immediately for an invalid email format', fakeAsync(() => {
    let result: boolean | undefined;
    service.checkEmailExists('not-an-email').subscribe(v => (result = v));
    tick(0);
    expect(result).toBe(false);
  }));

  it('returns false immediately for null', fakeAsync(() => {
    let result: boolean | undefined;
    service.checkEmailExists(null).subscribe(v => (result = v));
    tick(0);
    expect(result).toBe(false);
  }));

  it('is case-insensitive for taken emails', fakeAsync(() => {
    let result: boolean | undefined;
    service.checkEmailExists('TEST@EXAMPLE.COM').subscribe(v => (result = v));
    tick(800);
    expect(result).toBe(true);
  }));

  describe('error simulation', () => {
    afterEach(() => {
      if (service.simulateError()) {
        service.toggleSimulateError();
      }
    });

    it('throws when simulateError is enabled', fakeAsync(() => {
      service.toggleSimulateError();
      let error: Error | undefined;
      service.checkEmailExists('user@example.com').subscribe({ error: e => (error = e) });
      tick(800);
      expect(error).toBeTruthy();
      expect(error?.message).toBe('Simulated network error');
    }));

    it('toggles simulateError signal', () => {
      expect(service.simulateError()).toBe(false);
      service.toggleSimulateError();
      expect(service.simulateError()).toBe(true);
      service.toggleSimulateError();
      expect(service.simulateError()).toBe(false);
    });
  });
});

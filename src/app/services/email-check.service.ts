import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, mergeMap } from 'rxjs/operators';
import { isValidEmailFormat } from '../validators/email.validator';

@Injectable({ providedIn: 'root' })
export class EmailCheckService {
  simulateError = signal(false);

  private readonly simulatedTakenEmails = new Set<string>([
    'test@example.com',
    'john@doe.com',
    'jane@doe.com'
  ]);

  checkEmailExists(email: string | null | undefined): Observable<boolean> {
    if (!email || !isValidEmailFormat(email)) {
      return of(false);
    }
    return of(email).pipe(
      delay(800),
      mergeMap(value => {
        if (this.simulateError()) {
          return throwError(() => new Error('Simulated network error'));
        }
        return of(this.simulatedTakenEmails.has(value.trim().toLowerCase()));
      })
    );
  }

  toggleSimulateError(): void {
    this.simulateError.update(v => !v);
  }
}



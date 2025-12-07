import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EmailCheckService {
  private readonly simulatedTakenEmails = new Set<string>([
    'test@example.com',
    'john@doe.com',
    'jane@doe.com'
  ]);

  checkEmailExists(email: string | null | undefined): Observable<boolean> {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9][a-zA-Z0-9-]*(\.[a-zA-Z0-9][a-zA-Z0-9-]*)*\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return of(false);
    }
    return of(email)
      .pipe(
        delay(800),
        map(value => this.simulatedTakenEmails.has(value.trim().toLowerCase()))
      );
  }
}



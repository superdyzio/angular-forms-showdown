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
    if (!email || !email.includes('@')) {
      return of(false);
    }
    return of(email)
      .pipe(
        delay(800),
        map(value => this.simulatedTakenEmails.has(value.trim().toLowerCase()))
      );
  }
}



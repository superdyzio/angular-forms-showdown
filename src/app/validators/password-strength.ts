export interface PasswordStrength {
  score: number;
  /** ngx-translate key — use with the translate pipe or TranslateService.instant() */
  labelKey: string;
  color: string;
}

/**
 * Computes a password strength score (0–5) based on five criteria:
 *   length ≥ 8, lowercase letter, uppercase letter, digit, special character
 *
 * Returns a score of 0 and empty labelKey/color for a blank password.
 */
export function getPasswordStrength(password: string | null | undefined): PasswordStrength {
  if (!password) {
    return { score: 0, labelKey: '', color: '' };
  }

  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  if (score <= 2) {
    return { score, labelKey: 'password.weak', color: '#ff4444' };
  } else if (score <= 3) {
    return { score, labelKey: 'password.fair', color: '#ffaa00' };
  } else if (score <= 4) {
    return { score, labelKey: 'password.good', color: '#00aa00' };
  } else {
    return { score, labelKey: 'password.strong', color: '#00aa00' };
  }
}

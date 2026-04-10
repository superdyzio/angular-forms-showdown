import { getPasswordStrength } from './password-strength';

describe('getPasswordStrength()', () => {
  describe('empty / blank input', () => {
    it('returns score 0 for null', () => {
      expect(getPasswordStrength(null).score).toBe(0);
    });

    it('returns score 0 for undefined', () => {
      expect(getPasswordStrength(undefined).score).toBe(0);
    });

    it('returns score 0 for empty string', () => {
      expect(getPasswordStrength('').score).toBe(0);
    });

    it('returns empty labelKey and color for blank input', () => {
      const result = getPasswordStrength('');
      expect(result.labelKey).toBe('');
      expect(result.color).toBe('');
    });
  });

  describe('individual criteria', () => {
    it('awards a point for length ≥ 8', () => {
      expect(getPasswordStrength('abcdefgh').score).toBeGreaterThanOrEqual(1);
    });

    it('awards a point for a lowercase letter', () => {
      expect(getPasswordStrength('a').score).toBeGreaterThanOrEqual(1);
    });

    it('awards a point for an uppercase letter', () => {
      expect(getPasswordStrength('A').score).toBeGreaterThanOrEqual(1);
    });

    it('awards a point for a digit', () => {
      expect(getPasswordStrength('1').score).toBeGreaterThanOrEqual(1);
    });

    it('awards a point for a special character', () => {
      expect(getPasswordStrength('@').score).toBeGreaterThanOrEqual(1);
    });
  });

  describe('score bands', () => {
    it('returns score 5 for a password meeting all criteria', () => {
      expect(getPasswordStrength('StrongP@ss1').score).toBe(5);
    });

    it('returns score ≤ 2 for a weak password', () => {
      expect(getPasswordStrength('weak').score).toBeLessThanOrEqual(2);
    });

    it('returns score 3 for a fair password', () => {
      // lowercase + uppercase + length ≥ 8
      expect(getPasswordStrength('Abcdefgh').score).toBe(3);
    });

    it('returns score 4 for a good password', () => {
      // lowercase + uppercase + digit + length ≥ 8
      expect(getPasswordStrength('Abcdefg1').score).toBe(4);
    });
  });

  describe('labelKey', () => {
    it('returns password.weak for score ≤ 2', () => {
      expect(getPasswordStrength('weak').labelKey).toBe('password.weak');
    });

    it('returns password.fair for score 3', () => {
      expect(getPasswordStrength('Abcdefgh').labelKey).toBe('password.fair');
    });

    it('returns password.good for score 4', () => {
      expect(getPasswordStrength('Abcdefg1').labelKey).toBe('password.good');
    });

    it('returns password.strong for score 5', () => {
      expect(getPasswordStrength('StrongP@ss1').labelKey).toBe('password.strong');
    });
  });

  describe('color', () => {
    it('returns red (#ff4444) for weak passwords', () => {
      expect(getPasswordStrength('weak').color).toBe('#ff4444');
    });

    it('returns amber (#ffaa00) for fair passwords', () => {
      expect(getPasswordStrength('Abcdefgh').color).toBe('#ffaa00');
    });

    it('returns green (#00aa00) for good passwords', () => {
      expect(getPasswordStrength('Abcdefg1').color).toBe('#00aa00');
    });

    it('returns green (#00aa00) for strong passwords', () => {
      expect(getPasswordStrength('StrongP@ss1').color).toBe('#00aa00');
    });
  });
});

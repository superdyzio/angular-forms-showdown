import { isValidEmailFormat } from './email.validator';

describe('isValidEmailFormat', () => {
  describe('valid emails', () => {
    it('accepts a standard email', () => {
      expect(isValidEmailFormat('user@example.com')).toBe(true);
    });

    it('accepts email with subdomain', () => {
      expect(isValidEmailFormat('user@mail.example.com')).toBe(true);
    });

    it('accepts email with plus tag', () => {
      expect(isValidEmailFormat('user+tag@example.com')).toBe(true);
    });

    it('accepts email with dots in local part', () => {
      expect(isValidEmailFormat('first.last@example.com')).toBe(true);
    });

    it('accepts email with numeric local part', () => {
      expect(isValidEmailFormat('123@example.com')).toBe(true);
    });
  });

  describe('invalid emails', () => {
    it('rejects missing @', () => {
      expect(isValidEmailFormat('userexample.com')).toBe(false);
    });

    it('rejects missing domain', () => {
      expect(isValidEmailFormat('user@')).toBe(false);
    });

    it('rejects missing TLD', () => {
      expect(isValidEmailFormat('user@example')).toBe(false);
    });

    it('rejects empty string', () => {
      expect(isValidEmailFormat('')).toBe(false);
    });

    it('rejects double dot in domain', () => {
      expect(isValidEmailFormat('user@exam..ple.com')).toBe(false);
    });

    it('rejects whitespace', () => {
      expect(isValidEmailFormat('user @example.com')).toBe(false);
    });

    it('rejects domain starting with hyphen', () => {
      expect(isValidEmailFormat('user@-example.com')).toBe(false);
    });
  });
});

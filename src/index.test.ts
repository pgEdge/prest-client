import { isValidUsername, parseSafeInt } from './'; // Assuming your script is in the same directory

describe('unit tests', () => {
  // Tests for isValidUsername
  describe('isValidUsername', () => {
    it('returns true for valid usernames', () => {
      expect(isValidUsername('test_user123')).toBe(true);
      expect(isValidUsername('AdaLovelace')).toBe(true);
    });

    it('returns false for invalid usernames', () => {
      expect(isValidUsername('123invalid')).toBe(false);
      expect(isValidUsername('user name')).toBe(false); // Space in the middle
      expect(isValidUsername('')).toBe(false); // Empty string
      expect(isValidUsername('user123!')).toBe(false); // Special character
    });
  });

  // Tests for parseSafeInt
  describe('parseSafeInt', () => {
    it('parses valid strings to integers', () => {
      expect(parseSafeInt('100')).toBe(100);
      expect(parseSafeInt('-54')).toBe(-54);
      expect(parseSafeInt('0')).toBe(0);
    });

    it('throws error for invalid strings', () => {
      expect(() => parseSafeInt('hello')).toThrowError(
        'Invalid integer: hello',
      );
      expect(() => parseSafeInt('')).toThrowError('Invalid integer: '); // Empty string
    });
  });
});

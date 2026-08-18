import { formatDate } from '../helpers';

describe('formatDate', () => {
    it('returns empty string for null or undefined input', () => {
        expect(formatDate(null)).toBe('');
        expect(formatDate(undefined)).toBe('');
        expect(formatDate('')).toBe('');
    });

    it('returns empty string for invalid date strings', () => {
        expect(formatDate('invalid-date')).toBe('');
        expect(formatDate('not a date')).toBe('');
    });

    it('formats valid ISO date strings correctly', () => {
        const iso = '2026-08-15T12:00:00.000Z';
        const formatted = formatDate(iso);
        expect(formatted).toMatch(/Aug 15, 2026/);
    });

    it('handles different valid date inputs', () => {
        const iso = '2025-05-15T12:00:00.000Z';
        const formatted = formatDate(iso);
        expect(formatted).toMatch(/May 15, 2025/);
    });
});

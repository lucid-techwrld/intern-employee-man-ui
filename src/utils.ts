import { ApiError } from './api/client';

export const HUES = [18, 172, 262, 205, 340, 38];
export const money = (n: number) => '\u20A6' + Math.round(n).toLocaleString();
export const compact = (n: number) => (n >= 1e6 ? `\u20A6${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `\u20A6${Math.round(n / 1e3)}K` : `\u20A6${Math.round(n)}`);
export const fmtDate = (d: string) => new Date(d + 'T00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
export const initials = (first: string, last: string) => (first[0] + last[0]).toUpperCase();
export const today = () => new Date().toISOString().slice(0, 10);
export const errMsg = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong. Please try again.');
export const splitError = (e: unknown): { fields: Record<string, string>; banner: string } =>
  e instanceof ApiError && Object.keys(e.errors).length ? { fields: e.errors, banner: '' } : { fields: {}, banner: errMsg(e) };

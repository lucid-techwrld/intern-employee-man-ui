import { useId } from 'react';

export function Logo({ size = 38 }: { size?: number }) {
  const gid = 'lg' + useId().replace(/:/g, '');
  return (
    <span className="logo-lockup">
      <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
        <defs><linearGradient id={gid} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F2570C" /><stop offset="1" stopColor="#FF9A3D" /></linearGradient></defs>
        <rect width="40" height="40" rx="11" fill={`url(#${gid})`} />
        <circle cx="26" cy="14" r="4.6" fill="#fff" opacity=".7" />
        <path d="M19 30c.4-5.4 3.6-8 7-8s7.2 2.6 7.6 8z" fill="#fff" opacity=".7" />
        <circle cx="16" cy="15" r="5.2" fill="#fff" />
        <path d="M6 32c0-6.4 4.4-9.6 10-9.6s10 3.2 10 9.6z" fill="#fff" />
      </svg>
      <span className="wm">Crew</span>
    </span>
  );
}

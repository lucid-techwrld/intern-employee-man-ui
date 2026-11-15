import { AlertTriangle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ReactNode, useEffect, useRef } from 'react';
import { EmployeeStatus, IMeta } from '../types';
import { HUES, initials } from '../utils';
import { Face } from './Face';

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className="dh"><h3>{title}</h3><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
      {open && children}
    </dialog>
  );
}

export function PageHeader({ title, sub, action }: { title: string; sub: string; action?: ReactNode }) {
  return <div className="ph"><div><h1>{title}</h1><p>{sub}</p></div>{action && <div className="acts">{action}</div>}</div>;
}

export function Field({ label, error, className, children }: { label: string; error?: string; className?: string; children: ReactNode }) {
  return <label className={className}>{label}{children}<span className="err">{error}</span></label>;
}

export function ErrorBanner({ message }: { message: string }) {
  return message ? <div className="banner w" role="alert"><AlertTriangle size={18} />{message}</div> : null;
}

export function Skeletons({ n = 4 }: { n?: number }) {
  return <>{Array.from({ length: n }, (_, i) => <div className="skeleton" key={i} />)}</>;
}

export function StatusBadge({ status }: { status: EmployeeStatus }) {
  return <span className={`badge ${status.split(' ')[0]}`}>{status}</span>;
}

export function Avatar({ id, first, last, large }: { id: number; first: string; last: string; large?: boolean }) {
  return (
    <Face
      seed={`${first} ${last}`}
      className={`av ${large ? 'lg' : ''}`}
      fallback={initials(first, last)}
      style={{ background: `linear-gradient(135deg, hsl(${HUES[id % 6]} 70% 52%), hsl(${HUES[id % 6] + 30} 70% 40%))` }}
    />
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <svg viewBox="0 0 160 120" width="160" height="120" aria-hidden="true">
        <ellipse cx="80" cy="108" rx="62" ry="7" fill="var(--soft)" />
        <circle cx="58" cy="52" r="18" fill="var(--soft)" stroke="var(--brand)" strokeWidth="3" />
        <path d="M26 100c0-18 14-30 32-30s32 12 32 30z" fill="var(--soft)" stroke="var(--brand)" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="108" cy="58" r="14" fill="var(--panel)" stroke="var(--teal)" strokeWidth="3" />
        <path d="M84 100c0-14 10-24 24-24s24 10 24 24z" fill="var(--panel)" stroke="var(--teal)" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="132" cy="26" r="8" fill="#FFB020" />
      </svg>
      <h3>{title}</h3><p style={{ margin: 0 }}>{text}</p>{action}
    </div>
  );
}

export function Pagination({ meta, onPage }: { meta: IMeta; onPage: (p: number) => void }) {
  if (meta.total === 0) return null;
  const pages = Math.max(1, Math.ceil(meta.total / meta.limit));
  const from = (meta.page - 1) * meta.limit + 1;
  return (
    <div className="pager">
      <span>{from}–{Math.min(meta.total, from + meta.limit - 1)} of {meta.total}</span>
      <div>
        <button className="btn ghost sm" disabled={meta.page <= 1} onClick={() => onPage(meta.page - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
        <button className="btn ghost sm" disabled={meta.page >= pages} onClick={() => onPage(meta.page + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

import { IDashboard } from '../types';

export function DepartmentBars({ data }: { data: IDashboard['by_department'] }) {
  const max = Math.max(1, ...data.map((d) => d.headcount));
  return <>{data.map((d) => (
    <div className="dep" key={d.id}><span>{d.name}</span><div className="bar"><i style={{ width: `${Math.max(4, (d.headcount / max) * 100)}%` }} /></div><b>{d.headcount}</b></div>
  ))}</>;
}

export function HiresChart({ data }: { data: IDashboard['hires_by_month'] }) {
  const max = Math.max(3, ...data.map((d) => d.hires));
  const H = 120, bw = 38, gap = (440 - data.length * bw) / (data.length + 1);
  return (
    <svg viewBox={`0 0 460 ${H + 44}`} width="100%" role="img" aria-label="New hires per month">
      {[0, 0.5, 1].map((t) => <line key={t} x1="8" x2="452" y1={14 + H * t} y2={14 + H * t} stroke="var(--line)" strokeDasharray="3 4" />)}
      {data.map((d, i) => {
        const h = (d.hires / max) * H;
        const x = 10 + gap + i * (bw + gap);
        return (
          <g key={d.month}>
            <rect x={x} y={14 + H - Math.max(h, 3)} width={bw} height={Math.max(h, 3)} rx="9" fill={i === data.length - 1 ? 'var(--brand)' : 'var(--teal)'} opacity={i === data.length - 1 ? 1 : 0.75} />
            {d.hires > 0 && <text x={x + bw / 2} y={14 + H - h - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--ink)">{d.hires}</text>}
            <text x={x + bw / 2} y={H + 36} textAnchor="middle" fontSize="11" fill="var(--mute)">{new Date(d.month + '-01T00:00').toLocaleDateString(undefined, { month: 'short' })}</text>
          </g>
        );
      })}
    </svg>
  );
}

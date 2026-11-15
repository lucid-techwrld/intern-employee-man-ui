import { Banknote, Download, Plane, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import { dashboardApi, employeesApi } from '../api/hr';
import { DepartmentBars, HiresChart } from '../components/charts';
import { EmployeeFormDialog } from '../components/EmployeeFormDialog';
import { Avatar, EmptyState, ErrorBanner, PageHeader, StatusBadge } from '../components/ui';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../hooks/useToast';
import { compact, errMsg, fmtDate, money } from '../utils';

export default function Dashboard() {
  const toast = useToast();
  const { data: d, error, reload } = useFetch(() => dashboardApi.get(), []);
  const [formOpen, setFormOpen] = useState(false);

  const exportReport = async () => {
    try { await employeesApi.exportCsv({}); } catch (e) { toast(errMsg(e)); }
  };
  const stats = d ? [
    { icon: Users, label: 'Employees', value: d.total, sub: `${d.active} active`, tone: '' },
    { icon: Plane, label: 'On leave', value: d.on_leave, sub: '', tone: 'w' },
    { icon: UserPlus, label: 'New hires', value: d.new_hires_30d, sub: 'last 30 days', tone: 't' },
    { icon: Banknote, label: 'Monthly payroll', value: compact(d.monthly_payroll), sub: '', tone: '' },
  ] : [];

  return (
    <div className="page">
      <PageHeader title="Workforce overview" sub="Headcount, hiring and payroll at a glance."
        action={<><button className="btn ghost" onClick={exportReport}><Download size={17} />Export report</button><button className="btn" onClick={() => setFormOpen(true)}><UserPlus size={17} />Add employee</button></>} />
      {error && <ErrorBanner message={error} />}
      <div className="stats">
        {stats.map(({ icon: Icon, label, value, sub, tone }) => (
          <div key={label} className="stat"><span className={`ic ${tone}`}><Icon size={22} /></span><div><b>{value}</b><small>{label}{sub ? ` · ${sub}` : ''}</small></div></div>
        ))}
      </div>
      {d && <>
        <div className="two">
          <div className="card"><div className="ch"><h3>Hiring trend</h3><span className="mt">Last 6 months</span></div><div className="cb"><HiresChart data={d.hires_by_month} /></div></div>
          <div className="card"><div className="ch"><h3>Headcount by department</h3></div><div className="cb"><DepartmentBars data={d.by_department} /></div></div>
        </div>
        <div className="two eq">
          <div className="card"><div className="ch"><h3>Recent hires</h3></div>
            {d.recent_hires.length === 0 ? <EmptyState title="No employees yet" text="Add your first employee to get started." /> : d.recent_hires.map((e) => (
              <div className="row" key={e.id} style={{ marginTop: 8 }}>
                <div className="who"><Avatar id={e.id} first={e.first_name} last={e.last_name} /><div><b>{e.first_name} {e.last_name}</b><span className="mt">{e.job_title} · {e.department_name}</span></div></div>
                <div style={{ textAlign: 'right' }}><StatusBadge status={e.status} /><span className="mt" style={{ display: 'block' }}>{fmtDate(e.hire_date)}</span></div>
              </div>
            ))}
          </div>
          <div className="card"><div className="ch"><h3>Payroll by department</h3><span className="mt">Avg {money(d.avg_salary)}</span></div>
            {d.by_department.map((p) => (
              <div className="row" key={p.id} style={{ marginTop: 8 }}>
                <div><b>{p.name}</b><span className="mt">{p.headcount} people · avg {compact(p.avg_salary)}</span></div>
                <b>{compact(p.payroll)}</b>
              </div>
            ))}
          </div>
        </div>
      </>}
      <EmployeeFormDialog open={formOpen} employee={null} onClose={() => setFormOpen(false)} onSaved={reload} />
    </div>
  );
}

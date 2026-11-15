import { ChevronDown, ChevronUp, Download, Pencil, Search, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { departmentsApi, employeesApi } from '../api/hr';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmployeeFormDialog } from '../components/EmployeeFormDialog';
import { Avatar, EmptyState, ErrorBanner, PageHeader, Pagination, Skeletons, StatusBadge } from '../components/ui';
import { useDebounce } from '../hooks/useDebounce';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../hooks/useToast';
import { IEmployee } from '../types';
import { errMsg, fmtDate, money } from '../utils';

const STATUS_TABS = ['', 'Active', 'On leave', 'Terminated'];

export default function Employees() {
  const toast = useToast();
  const [q, setQ] = useState('');
  const dq = useDebounce(q);
  const [department, setDepartment] = useState<number | ''>('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('name');
  const [dir, setDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch(() => employeesApi.list({ q: dq, department_id: department, status, sort, dir, page, limit: 10 }), [dq, department, status, sort, dir, page]);
  const { data: departments } = useFetch(() => departmentsApi.list(), []);
  const [form, setForm] = useState<{ open: boolean; employee: IEmployee | null }>({ open: false, employee: null });
  const [del, setDel] = useState<IEmployee | null>(null);
  const employees = data?.data ?? [];

  const sortBy = (id: string) => { if (sort === id) setDir(dir === 'asc' ? 'desc' : 'asc'); else { setSort(id); setDir('asc'); } setPage(1); };
  const head = (id: string, label: string, right?: boolean) => (
    <div className={right ? 'r' : ''}><button onClick={() => sortBy(id)}>{label}{sort === id && (dir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</button></div>
  );
  const remove = async () => {
    if (!del) return;
    try { await employeesApi.remove(del.id); toast('Employee deleted'); reload(); } catch (e) { toast(errMsg(e)); }
    setDel(null);
  };
  const exportCsv = async () => { try { await employeesApi.exportCsv({ q: dq, department_id: department, status, sort, dir }); } catch (e) { toast(errMsg(e)); } };

  return (
    <div className="page">
      <PageHeader title="Employees" sub="Everyone on your team, with search, filters and exports."
        action={<><button className="btn ghost" onClick={exportCsv}><Download size={17} />Export CSV</button><button className="btn" onClick={() => setForm({ open: true, employee: null })}><UserPlus size={17} />Add employee</button></>} />
      <div className="toolbar">
        <div className="search"><Search size={18} /><input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search name, email, ID or job title" aria-label="Search employees" /></div>
        <select className="select" value={department} onChange={(e) => { setDepartment(e.target.value ? Number(e.target.value) : ''); setPage(1); }} aria-label="Department">
          <option value="">All departments</option>{departments?.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <div className="tabs" role="tablist">{STATUS_TABS.map((t) => <button key={t} role="tab" aria-selected={status === t} onClick={() => { setStatus(t); setPage(1); }}>{t || 'All'}</button>)}</div>
      </div>
      {error && <ErrorBanner message={error} />}
      <div className="card">
        <div className="thead">{head('name', 'Employee')}{head('department', 'Department')}{head('salary', 'Salary', true)}{head('hire_date', 'Hired')}<span>Status</span><span /></div>
        {loading && !data ? <Skeletons />
          : employees.length === 0 ? <EmptyState title="No employees found" text="Try a different search or clear the filters." />
          : employees.map((e) => (
            <div className="trow" key={e.id}>
              <div className="c-who who"><Avatar id={e.id} first={e.first_name} last={e.last_name} /><div style={{ minWidth: 0 }}><b>{e.first_name} {e.last_name}</b><span className="mt">{e.job_title} · {e.employee_code}</span></div></div>
              <div className="c-dept"><span className="pill">{e.department_name}</span></div>
              <div className="c-sal"><b>{money(e.salary)}</b></div>
              <div className="c-hired mt">{fmtDate(e.hire_date)}</div>
              <div className="c-status"><StatusBadge status={e.status} /></div>
              <div className="c-act">
                <button className="icon-btn" title="Edit" aria-label={`Edit ${e.first_name} ${e.last_name}`} onClick={() => setForm({ open: true, employee: e })}><Pencil size={17} /></button>
                <button className="icon-btn del" title="Delete" aria-label={`Delete ${e.first_name} ${e.last_name}`} onClick={() => setDel(e)}><Trash2 size={17} /></button>
              </div>
            </div>))}
        {data && <Pagination meta={data.meta} onPage={setPage} />}
      </div>
      <EmployeeFormDialog open={form.open} employee={form.employee} onClose={() => setForm((f) => ({ ...f, open: false }))} onSaved={reload} />
      <ConfirmDialog open={!!del} title="Delete employee?" message={del ? `${del.first_name} ${del.last_name} will be permanently removed from your records.` : ''} confirmLabel="Delete employee" onClose={() => setDel(null)} onConfirm={remove} />
    </div>
  );
}

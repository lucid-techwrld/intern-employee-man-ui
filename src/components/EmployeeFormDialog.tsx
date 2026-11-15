import { ChangeEvent, FormEvent, useState } from 'react';
import { departmentsApi, employeesApi } from '../api/hr';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../hooks/useToast';
import { EmployeeStatus, IEmployee } from '../types';
import { splitError, today } from '../utils';
import { ErrorBanner, Field, Modal } from './ui';

interface Props { open: boolean; employee: IEmployee | null; onClose: () => void; onSaved: () => void }

export function EmployeeFormDialog({ open, employee, onClose, onSaved }: Props) {
  return <Modal open={open} onClose={onClose} title={employee ? 'Edit employee' : 'Add an employee'}><EmployeeForm employee={employee} onClose={onClose} onSaved={onSaved} /></Modal>;
}

function EmployeeForm({ employee, onClose, onSaved }: Omit<Props, 'open'>) {
  const toast = useToast();
  const { data: departments } = useFetch(() => departmentsApi.list(), []);
  const [f, setF] = useState({
    first_name: employee?.first_name ?? '', last_name: employee?.last_name ?? '', email: employee?.email ?? '', phone: employee?.phone ?? '',
    department_id: employee ? String(employee.department_id) : '', job_title: employee?.job_title ?? '', salary: employee ? String(employee.salary) : '',
    hire_date: employee?.hire_date ?? today(), status: (employee?.status ?? 'Active') as EmployeeStatus,
  });
  const [err, setErr] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof f) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.first_name.trim()) er.first_name = 'Enter a first name';
    if (!f.last_name.trim()) er.last_name = 'Enter a last name';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email address';
    if (!f.department_id) er.department_id = 'Pick a department';
    if (!f.job_title.trim()) er.job_title = 'Enter a job title';
    if (f.salary === '' || Number(f.salary) < 0) er.salary = 'Enter a salary';
    if (!f.hire_date) er.hire_date = 'Pick a hire date';
    setErr(er); setBanner('');
    if (Object.keys(er).length) return;
    setSaving(true);
    try {
      const input = { ...f, phone: f.phone.trim() || null, department_id: Number(f.department_id), salary: Number(f.salary) };
      if (employee) await employeesApi.update(employee.id, input); else await employeesApi.create(input);
      toast(employee ? 'Changes saved' : 'Employee added');
      onSaved(); onClose();
    } catch (x) { const s = splitError(x); setErr(s.fields); setBanner(s.banner); } finally { setSaving(false); }
  };

  return (
    <form className="db" onSubmit={submit} noValidate>
      <ErrorBanner message={banner} />
      <Field label="First name" error={err.first_name}><input value={f.first_name} onChange={set('first_name')} autoFocus /></Field>
      <Field label="Last name" error={err.last_name}><input value={f.last_name} onChange={set('last_name')} /></Field>
      <Field label="Work email" error={err.email} className="w"><input type="email" value={f.email} onChange={set('email')} /></Field>
      <Field label="Phone (optional)" error={err.phone}><input inputMode="tel" value={f.phone} onChange={set('phone')} /></Field>
      <Field label="Department" error={err.department_id}>
        <select value={f.department_id} onChange={set('department_id')}><option value="">Select department</option>{departments?.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
      </Field>
      <Field label="Job title" error={err.job_title}><input value={f.job_title} onChange={set('job_title')} /></Field>
      <Field label="Monthly salary (₦)" error={err.salary}><input type="number" min={0} step="any" value={f.salary} onChange={set('salary')} /></Field>
      <Field label="Hire date" error={err.hire_date}><input type="date" max={today()} value={f.hire_date} onChange={set('hire_date')} /></Field>
      <Field label="Status"><select value={f.status} onChange={set('status')}><option>Active</option><option>On leave</option><option>Terminated</option></select></Field>
      <div className="foot"><button type="button" className="btn ghost" onClick={onClose}>Cancel</button><button className="btn" disabled={saving}>{saving ? 'Saving…' : 'Save employee'}</button></div>
    </form>
  );
}

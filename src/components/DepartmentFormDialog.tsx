import { FormEvent, useState } from 'react';
import { departmentsApi } from '../api/hr';
import { useToast } from '../hooks/useToast';
import { IDepartment } from '../types';
import { splitError } from '../utils';
import { ErrorBanner, Field, Modal } from './ui';

interface Props { open: boolean; department: IDepartment | null; onClose: () => void; onSaved: () => void }

export function DepartmentFormDialog({ open, department, onClose, onSaved }: Props) {
  return <Modal open={open} onClose={onClose} title={department ? 'Edit department' : 'Add a department'}><DepartmentForm department={department} onClose={onClose} onSaved={onSaved} /></Modal>;
}

function DepartmentForm({ department, onClose, onSaved }: Omit<Props, 'open'>) {
  const toast = useToast();
  const [name, setName] = useState(department?.name ?? '');
  const [description, setDescription] = useState(department?.description ?? '');
  const [err, setErr] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setErr({ name: 'Enter a department name' });
    setSaving(true); setErr({}); setBanner('');
    try {
      if (department) await departmentsApi.update(department.id, { name, description }); else await departmentsApi.create({ name, description });
      toast(department ? 'Changes saved' : 'Department added');
      onSaved(); onClose();
    } catch (x) { const s = splitError(x); setErr(s.fields); setBanner(s.banner); } finally { setSaving(false); }
  };

  return (
    <form className="db" onSubmit={submit} noValidate style={{ gridTemplateColumns: '1fr' }}>
      <ErrorBanner message={banner} />
      <Field label="Department name" error={err.name}><input value={name} onChange={(e) => setName(e.target.value)} autoFocus /></Field>
      <Field label="Description (optional)" error={err.description}><input value={description} maxLength={200} onChange={(e) => setDescription(e.target.value)} /></Field>
      <div className="foot"><button type="button" className="btn ghost" onClick={onClose}>Cancel</button><button className="btn" disabled={saving}>{saving ? 'Saving…' : 'Save department'}</button></div>
    </form>
  );
}

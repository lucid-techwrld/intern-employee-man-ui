import { Building2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { departmentsApi } from '../api/hr';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DepartmentFormDialog } from '../components/DepartmentFormDialog';
import { EmptyState, ErrorBanner, PageHeader, Skeletons } from '../components/ui';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../hooks/useToast';
import { IDepartment } from '../types';
import { errMsg, HUES } from '../utils';

export default function Departments() {
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => departmentsApi.list(), []);
  const [form, setForm] = useState<{ open: boolean; department: IDepartment | null }>({ open: false, department: null });
  const [del, setDel] = useState<IDepartment | null>(null);

  const remove = async () => {
    if (!del) return;
    try { await departmentsApi.remove(del.id); toast('Department deleted'); reload(); } catch (e) { toast(errMsg(e)); }
    setDel(null);
  };

  return (
    <div className="page">
      <PageHeader title="Departments" sub="Organise your team and see how big each group is."
        action={<button className="btn" onClick={() => setForm({ open: true, department: null })}><Plus size={17} />Add department</button>} />
      {error && <ErrorBanner message={error} />}
      {loading && !data ? <div className="card"><Skeletons n={3} /></div>
        : (data ?? []).length === 0 ? <div className="card"><EmptyState title="No departments yet" text="Create a department to start adding employees." /></div>
        : <div className="deps">{data!.map((d) => (
            <div className="dcard" key={d.id}>
              <div className="top">
                <span className="ic" style={{ background: `linear-gradient(135deg, hsl(${HUES[d.id % 6]} 70% 52%), hsl(${HUES[d.id % 6] + 30} 70% 40%))` }}><Building2 size={22} /></span>
                <div><button className="icon-btn" aria-label={`Edit ${d.name}`} onClick={() => setForm({ open: true, department: d })}><Pencil size={17} /></button><button className="icon-btn del" aria-label={`Delete ${d.name}`} onClick={() => setDel(d)}><Trash2 size={17} /></button></div>
              </div>
              <h3>{d.name}</h3>
              <p>{d.description || 'No description yet.'}</p>
              <div className="foot2"><span className="pill">{d.headcount} {d.headcount === 1 ? 'person' : 'people'}</span></div>
            </div>))}</div>}
      <DepartmentFormDialog open={form.open} department={form.department} onClose={() => setForm((f) => ({ ...f, open: false }))} onSaved={reload} />
      <ConfirmDialog open={!!del} title="Delete department?" message={del ? `${del.name} will be removed. This only works when it has no employees.` : ''} confirmLabel="Delete department" onClose={() => setDel(null)} onConfirm={remove} />
    </div>
  );
}

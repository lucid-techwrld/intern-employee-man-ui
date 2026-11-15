import { IDashboard, IDepartment, IEmployee, IEmployeeInput, IPage } from '../types';
import { apiClient } from './client';

const qs = (o: object) => {
  const p = new URLSearchParams();
  Object.entries(o as Record<string, unknown>).forEach(([k, v]) => { if (v !== '' && v !== undefined && v !== null) p.set(k, String(v)); });
  return p.toString();
};
const json = (method: string, body?: unknown): RequestInit => ({ method, body: body === undefined ? undefined : JSON.stringify(body) });
const unwrap = async <T>(req: Promise<{ data: T }>) => (await req).data;

export interface EmployeeFilters { q?: string; department_id?: number | ''; status?: string; sort?: string; dir?: string }

export const employeesApi = {
  list: (f: EmployeeFilters & { page?: number; limit?: number }) => apiClient.request<IPage<IEmployee>>(`/employees?${qs(f)}`),
  create: (i: IEmployeeInput) => unwrap(apiClient.request<{ data: IEmployee }>('/employees', json('POST', i))),
  update: (id: number, i: IEmployeeInput) => unwrap(apiClient.request<{ data: IEmployee }>(`/employees/${id}`, json('PUT', i))),
  remove: (id: number) => apiClient.request<void>(`/employees/${id}`, json('DELETE')),
  exportCsv: (f: EmployeeFilters) => apiClient.download(`/employees/export?${qs(f)}`, 'employees.csv'),
};
export const departmentsApi = {
  list: () => unwrap(apiClient.request<{ data: IDepartment[] }>('/departments')),
  create: (i: { name: string; description: string }) => unwrap(apiClient.request<{ data: IDepartment }>('/departments', json('POST', i))),
  update: (id: number, i: { name: string; description: string }) => unwrap(apiClient.request<{ data: IDepartment }>(`/departments/${id}`, json('PUT', i))),
  remove: (id: number) => apiClient.request<void>(`/departments/${id}`, json('DELETE')),
};
export const dashboardApi = { get: () => unwrap(apiClient.request<{ data: IDashboard }>('/dashboard')) };

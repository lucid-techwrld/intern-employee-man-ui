export type EmployeeStatus = 'Active' | 'On leave' | 'Terminated';
export interface IDepartment { id: number; name: string; description: string | null; headcount: number }
export interface IEmployee {
  id: number; employee_code: string; first_name: string; last_name: string; email: string; phone: string | null;
  department_id: number; department_name: string; job_title: string; salary: number; hire_date: string; status: EmployeeStatus;
}
export type IEmployeeInput = Omit<IEmployee, 'id' | 'employee_code' | 'department_name'>;
export interface IMeta { page: number; limit: number; total: number }
export interface IPage<T> { data: T[]; meta: IMeta }
export interface IDashboard {
  total: number; active: number; on_leave: number; new_hires_30d: number; monthly_payroll: number; avg_salary: number;
  by_department: { id: number; name: string; headcount: number; avg_salary: number; payroll: number }[];
  hires_by_month: { month: string; hires: number }[];
  recent_hires: IEmployee[];
}

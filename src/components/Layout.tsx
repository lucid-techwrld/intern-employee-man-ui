import { Building2, LayoutDashboard, Moon, Sun, Users } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { Logo } from './Logo';
import { UserMenu } from './UserMenu';

const LINKS = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/departments', label: 'Departments', icon: Building2 },
];

export function Layout() {
  const { theme, toggle } = useTheme();
  return (
    <div className="app">
      <aside className="side">
        <div className="brand"><Logo /></div>
        <nav className="nav" aria-label="Main">
          {LINKS.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end}><Icon size={20} />{label}</NavLink>)}
        </nav>
        <UserMenu />
        <button className="theme" onClick={toggle} aria-label="Toggle theme">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}<span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span></button>
      </aside>
      <main><Outlet /></main>
    </div>
  );
}

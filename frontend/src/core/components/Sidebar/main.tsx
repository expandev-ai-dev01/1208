/**
 * @component Sidebar
 * @summary Application sidebar navigation
 * @domain core
 * @type ui-component
 * @category navigation
 */

import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, BarChart3, Settings } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Início' },
  { to: '/habits', icon: CheckSquare, label: 'Hábitos' },
  { to: '/statistics', icon: BarChart3, label: 'Estatísticas' },
  { to: '/settings', icon: Settings, label: 'Configurações' },
];

export const Sidebar = () => {
  return (
    <nav className="p-4 space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`
          }
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

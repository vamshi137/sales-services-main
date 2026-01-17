import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  Wallet,
  UserPlus,
  GraduationCap,
  Laptop,
  Plane,
  Target,
  AlertTriangle,
  MessageSquare,
  LogOut,
  FileText,
  Settings,
  Building2,
  ChevronLeft,
  ChevronRight,
  Shield,
  ClipboardList,
  Briefcase,
  FileCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
  badge?: string;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Organization', href: '/organization', icon: Building2, roles: ['admin', 'hr'] },
  // { title: 'Employees', href: '/employees', icon: Users },
  { title: 'Attendance', href: '/attendance', icon: Clock },
  { title: 'Leave', href: '/leave', icon: Calendar, badge: '3' },
  { title: 'Payroll', href: '/payroll', icon: Wallet, roles: ['admin', 'hr', 'accounts', 'employee'] },
  { title: 'Recruitment', href: '/recruitment', icon: UserPlus, roles: ['admin', 'hr'] },
  { title: 'Performance', href: '/performance', icon: Target },
  { title: 'Training', href: '/training', icon: GraduationCap },
  { title: 'Assets', href: '/assets', icon: Laptop },
  { title: 'Travel & Expense', href: '/travel', icon: Plane },
  { title: 'Disciplinary', href: '/disciplinary', icon: AlertTriangle, roles: ['admin', 'hr'] },
  { title: 'Grievance', href: '/grievance', icon: MessageSquare },
  { title: 'Separation', href: '/separation', icon: LogOut, roles: ['admin', 'hr'] },
  { title: 'Compliance', href: '/compliance', icon: Shield, roles: ['admin', 'hr', 'accounts'] },
  { title: 'Reports', href: '/reports', icon: FileText, roles: ['admin', 'hr', 'manager', 'accounts'] },
  { title: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return user?.role && item.roles.includes(user.role);
  });

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col',
          isCollapsed ? 'w-20' : 'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-bold text-base tracking-tight">SSSMS</span>
                <span className="text-muted-foreground text-[10px] font-medium">HR Management</span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md mx-auto">
              <span className="text-white font-bold text-lg">S</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 w-8 rounded-lg"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-muted-foreground hover:bg-sidebar-accent h-8 w-8 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4 px-3">
          <nav>
            <ul className="space-y-1">
              {filteredNavItems.map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 relative group',
                        isActive
                          ? 'bg-gradient-primary text-white font-medium shadow-md'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )
                    }
                  >
                    <item.icon className={cn('h-5 w-5 flex-shrink-0', isCollapsed && 'mx-auto')} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-accent text-white text-xs font-medium flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {isCollapsed && item.badge && (
                      <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-accent text-white text-[10px] font-medium flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>

        {/* User section */}
        {/* {user && (
          <div className="p-4 border-t border-sidebar-border">
            <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-muted-foreground text-xs capitalize">{user.role}</p>
                </div>
              )}
            </div>
          </div>
        )} */}
      </aside>
    </>
  );
};

export default Sidebar;
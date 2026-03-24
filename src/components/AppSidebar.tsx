import { Home, ArrowDownToLine, ArrowUpFromLine, Headphones, Gift, History, Gamepad2, Shield, Users } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

const items = [
  { title: 'Home', url: '/dashboard', icon: Home },
  { title: 'Deposit', url: '/dashboard/deposit', icon: ArrowDownToLine },
  { title: 'Withdraw', url: '/dashboard/withdraw', icon: ArrowUpFromLine },
  { title: 'History', url: '/dashboard/history', icon: History },
  { title: 'Referrals', url: '/dashboard/referrals', icon: Users },
  { title: 'Earn', url: '/dashboard/earn', icon: Gift },
  { title: 'Games', url: '/dashboard/games', icon: Gamepad2 },
  { title: 'Support', url: '/dashboard/support', icon: Headphones },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { signOut } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <div className="p-4 flex items-center gap-2">
        <img src="/logo2.png" alt="AmbrePay" className="h-8 w-8" />
        {!collapsed && (
          <span className="font-display font-bold text-lg text-foreground">
            Ambre<span className="text-primary">Pay</span>
          </span>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/dashboard'}
                      className="hover:bg-secondary/50 text-muted-foreground"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="border border-accent/30 rounded-lg p-3 text-center mb-3">
            <div className="flex justify-center mb-1">
              <span className="text-2xl">🇰🇪</span>
            </div>
            <p className="text-xs text-accent font-display font-semibold">
              HII NI YETU
            </p>
            <p className="text-xs text-accent/70">PAMOJA TWASONGA</p>
          </div>
        )}
        <button
          onClick={signOut}
          className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors text-left px-2"
        >
          {collapsed ? '→' : 'Sign Out'}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}

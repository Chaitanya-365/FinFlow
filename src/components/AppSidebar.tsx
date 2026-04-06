import { LayoutDashboard, ArrowLeftRight, Lightbulb, Moon, Sun, Shield, Eye } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useFinance } from "@/context/FinanceContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types/finance";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Transactions", url: "/transactions", icon: ArrowLeftRight },
  { title: "Insights", url: "/insights", icon: Lightbulb },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { role, setRole, darkMode, toggleDarkMode } = useFinance();
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
               <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-display font-bold text-sm text-foreground truncate">FinFlow</span>
                <span className="text-[10px] text-muted-foreground truncate uppercase tracking-widest font-semibold">{user?.name || "User"}</span>
              </div>
            )}
          </div>
          <SidebarGroupLabel className="font-display text-[10px] tracking-widest uppercase font-bold text-muted-foreground/50 px-4 mb-2">
            {!collapsed && "Platform"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {navItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} className="hover:bg-sidebar-accent/50 rounded-lg px-3" activeClassName="bg-sidebar-accent text-sidebar-primary font-bold">
                      <item.icon className="mr-3 h-4 w-4" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 gap-2 border-t border-sidebar-border/30">
        {!collapsed && (
          <Select value={role} onValueChange={(v: UserRole) => setRole(v)}>
            <SelectTrigger className="bg-sidebar-accent/30 border-sidebar-border/50 text-sidebar-foreground text-xs h-9 rounded-lg">
              <div className="flex items-center gap-2">
                {role === "admin" ? <Shield className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleDarkMode}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent h-9 rounded-lg px-3"
        >
          {darkMode ? <Sun className="h-4 w-4 mr-3" /> : <Moon className="h-4 w-4 mr-3" />}
          {!collapsed && <span className="text-xs font-medium">{darkMode ? "Light Mode" : "Dark Mode"}</span>}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive h-9 rounded-lg px-3"
        >
          <ArrowLeftRight className="h-4 w-4 mr-3 rotate-90" />
          {!collapsed && <span className="text-xs font-medium">Log out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

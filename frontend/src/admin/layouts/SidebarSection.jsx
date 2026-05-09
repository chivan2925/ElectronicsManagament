import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../../utils/classNames";

function isPathActive(path, pathname) {
  if (!path) {
    return false;
  }

  if (path === "/admin/dashboard") {
    return pathname === path || pathname === "/admin";
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}

function getItemClass({ collapsed, isActive }) {
  return cn(
    "group relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-blue-300/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111F]",
    collapsed && "justify-center px-0",
    isActive
      ? "bg-[#005BFF] text-white shadow-lg shadow-blue-950/30"
      : "text-slate-300 hover:bg-white/10 hover:text-white",
  );
}

function SidebarLink({ collapsed, item, onNavigate }) {
  const Icon = item.icon;

  if (item.disabled) {
    return (
      <button
        className={cn(
          "flex min-h-11 w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 text-sm font-bold text-slate-500",
          collapsed && "justify-center px-0",
        )}
        disabled
        title={item.label}
        type="button"
      >
        {Icon ? <Icon className="shrink-0" size={18} /> : null}
        {!collapsed && <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>}
        {!collapsed && item.badge ? (
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-black uppercase text-slate-400">
            {item.badge}
          </span>
        ) : null}
      </button>
    );
  }

  return (
    <NavLink
      className={({ isActive }) => getItemClass({ collapsed, isActive })}
      end={item.end}
      onClick={onNavigate}
      title={item.label}
      to={item.path}
    >
      {Icon ? <Icon className="shrink-0" size={18} /> : null}
      {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
      {!collapsed && item.badge ? (
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-black uppercase text-slate-300">
          {item.badge}
        </span>
      ) : null}
    </NavLink>
  );
}

function SidebarSection({ collapsed, onNavigate, section }) {
  const location = useLocation();
  const hasChildren = Boolean(section.children?.length);
  const isActive = useMemo(() => {
    if (section.path && isPathActive(section.path, location.pathname)) {
      return true;
    }

    return section.children?.some((item) => isPathActive(item.path, location.pathname)) ?? false;
  }, [location.pathname, section.children, section.path]);
  const [open, setOpen] = useState(false);
  const isExpanded = open || isActive;
  const Icon = section.icon;

  if (!hasChildren) {
    return <SidebarLink collapsed={collapsed} item={section} onNavigate={onNavigate} />;
  }

  if (collapsed) {
    return (
      <div className="space-y-1">
        {section.children.map((item) => (
          <SidebarLink collapsed item={item} key={item.key} onNavigate={onNavigate} />
        ))}
      </div>
    );
  }

  return (
    <section className="space-y-1">
      <button
        className={cn(
          "group flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-black outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-blue-300/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111F]",
          isActive ? "bg-white/12 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white",
        )}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {Icon ? <Icon className="shrink-0" size={18} /> : null}
        <span className="min-w-0 flex-1 truncate text-left">{section.label}</span>
        <ChevronDown className={cn("shrink-0 transition-transform duration-200", isExpanded && "rotate-180")} size={16} />
      </button>

      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 space-y-1 overflow-hidden pl-3">
          <div className="ml-3 border-l border-white/10 py-1 pl-3">
            {section.children.map((item) => (
              <SidebarLink collapsed={false} item={item} key={item.key} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SidebarSection;

import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  Home,
  LayoutDashboard,
  List,
  UsersRound,
  Wrench,
} from "lucide-react";
import { signOut } from "next-auth/react";
import SignoutButton from "./SignoutButton";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/roles", label: "Roles", icon: ClipboardList },
  { href: "/admin/members", label: "Members", icon: UsersRound },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/schedule", label: "Generate", icon: CalendarDays },
  { href: "/admin/roster", label: "Roster", icon: Home },
];

export function AdminNav() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-ink text-paper md:flex md:flex-col">
      <div className="border-b border-white/10 px-6 py-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
          Sunday
        </p>
        <h1 className="mt-2 font-serif text-3xl leading-none">Schedule</h1>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <item.icon size={17} />
            {item.label}
          </Link>
        ))}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <List size={17} />
          Public roster
        </Link>
      </nav>

      <SignoutButton />
    </aside>
  );
}

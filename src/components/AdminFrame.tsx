import { AdminNav } from "./AdminNav";

export function AdminFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white md:pl-64">
      <AdminNav />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-xl">
          <p className="text-xs uppercase tracking-[0.18em] text-blue-300">
            Admin Panel
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">{title}</h1>

          <div className="mt-4 h-px bg-gradient-to-r from-blue-400/40 to-transparent" />
        </header>

        {/* Content */}
        <div className="space-y-6">{children}</div>
      </div>
    </main>
  );
}

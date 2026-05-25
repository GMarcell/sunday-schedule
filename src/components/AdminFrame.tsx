import { AdminNav } from "./AdminNav";

export function AdminFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen md:pl-64">
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 border-b border-line pb-5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-rust">Admin</p>
          <h1 className="mt-2 font-serif text-4xl">{title}</h1>
        </header>
        {children}
      </div>
    </main>
  );
}

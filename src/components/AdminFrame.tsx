import { auth } from "@/auth";
import { AdminNav } from "./AdminNav";
import { redirect } from "next/navigation";

export async function AdminFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const session = await auth();
  const isDemo = session?.user.role === "demo";

  if (!session) {
    redirect("/login");
  }
  return (
    <main className="min-h-screen bg-indigo-950 text-white">
      {/* Sidebar */}
      <AdminNav />

      {/* Main Content */}
      <div className="w-full md:pl-64">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          {/* Header */}
          <header className="mb-6 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-xl sm:mb-8 sm:rounded-3xl sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-blue-300 sm:text-xs">
              Admin Panel
            </p>
            {isDemo && (
              <div className="bg-yellow-100 text-yellow-800 text-sm text-center py-2 px-4">
                You are using a demo account — changes are disabled.
              </div>
            )}

            <h1 className="mt-2 break-words text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              {title}
            </h1>

            <div className="mt-4 h-px bg-gradient-to-r from-blue-400/40 to-transparent" />
          </header>

          {/* Content */}
          <div className="space-y-4 sm:space-y-6">{children}</div>
        </div>
      </div>
    </main>
  );
}

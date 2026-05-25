import { auth } from "@/auth";
import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminFrame } from "@/components/AdminFrame";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <AdminFrame title="Dashboard">
      <AdminDashboard />
    </AdminFrame>
  );
}

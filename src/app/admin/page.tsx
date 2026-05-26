import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminFrame } from "@/components/AdminFrame";

export default async function AdminPage() {
  return (
    <AdminFrame title="Dashboard">
      <AdminDashboard />
    </AdminFrame>
  );
}

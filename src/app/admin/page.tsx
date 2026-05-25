import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminFrame } from "@/components/AdminFrame";

export default function AdminPage() {
  return (
    <AdminFrame title="Dashboard">
      <AdminDashboard />
    </AdminFrame>
  );
}

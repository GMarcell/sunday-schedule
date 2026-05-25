import { AdminFrame } from "@/components/AdminFrame";
import { RolesManager } from "@/components/RolesManager";

export default function RolesPage() {
  return (
    <AdminFrame title="Roles">
      <RolesManager />
    </AdminFrame>
  );
}

import { AdminFrame } from "@/components/AdminFrame";
import { MembersManager } from "@/components/MembersManager";

export default function MembersPage() {
  return (
    <AdminFrame title="Members">
      <MembersManager />
    </AdminFrame>
  );
}

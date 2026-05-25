import { AdminFrame } from "@/components/AdminFrame";
import { RosterManager } from "@/components/RosterManager";

export default function RosterPage() {
  return (
    <AdminFrame title="Roster">
      <RosterManager />
    </AdminFrame>
  );
}

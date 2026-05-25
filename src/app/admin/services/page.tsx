import { AdminFrame } from "@/components/AdminFrame";
import { ServicesManager } from "@/components/ServicesManager";

export default function ServicesPage() {
  return (
    <AdminFrame title="Services">
      <ServicesManager />
    </AdminFrame>
  );
}

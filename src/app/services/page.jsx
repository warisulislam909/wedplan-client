import { Suspense } from "react";
import BrowseServices from "@/components/services/BrowseServices";
import { Spinner } from "@/components/ui/skeleton";

export const metadata = { title: "Browse Services" };

export default function ServicesPage() {
  return (
    <Suspense fallback={<Spinner label="Loading services…" />}>
      <BrowseServices />
    </Suspense>
  );
}

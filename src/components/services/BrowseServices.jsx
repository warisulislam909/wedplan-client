"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX, X } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { qs } from "@/lib/api";
import { CATEGORY_NAMES } from "@/lib/constants";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ServiceCard, { ServiceCardSkeleton } from "./ServiceCard";
import Pagination from "@/components/dashboard/Pagination";

export default function BrowseServices() {
  const router = useRouter();
  const sp = useSearchParams();
  const category = sp.get("category") || "all";
  const location = sp.get("location") || "";
  const sort = sp.get("sort") || "newest";
  const page = Number(sp.get("page") || 1);
  const q = sp.get("q") || "";
  const [search, setSearch] = useState(q);
  const [loc, setLoc] = useState(location);

  const set = (patch) => {
    const next = { q, category, location, sort, page: 1, ...patch };
    const query = qs({ ...next, sort: next.sort === "newest" ? "" : next.sort, page: next.page > 1 ? next.page : "" });
    router.replace(`/services${query}`, { scroll: false });
  };

  // search/location এ debounce
  useEffect(() => {
    const t = setTimeout(() => { if (search !== q || loc !== location) set({ q: search, location: loc }); }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, loc]);

  const { data, loading, error, reload } = useApi(`/services${qs({ q, category, location, sort, page, limit: 9 })}`, { auth: false });
  const { data: locations } = useApi("/locations", { auth: false });
  const hasFilters = q || location || category !== "all" || sort !== "newest";

  return (
    <div className="container py-10">
      <h1 className="text-5xl font-semibold">Browse wedding services</h1>
      <p className="mt-2 text-muted-foreground">Search by name, narrow by category or location, and sort by price.</p>

      <div className="mt-8 grid gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[2fr_1.4fr_1.2fr_1.2fr_auto]">
        <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Search services" placeholder="Search by service name" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <Select aria-label="Category" value={category} onChange={(e) => set({ category: e.target.value })}>
          <option value="all">All categories</option>
          {CATEGORY_NAMES.map((c) => <option key={c}>{c}</option>)}
        </Select>
        <div>
          <Input aria-label="Location" list="locations" placeholder="Location" value={loc} onChange={(e) => setLoc(e.target.value)} />
          <datalist id="locations">{(locations || []).map((l) => <option key={l} value={l} />)}</datalist>
        </div>
        <Select aria-label="Sort by" value={sort} onChange={(e) => set({ sort: e.target.value })}>
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </Select>
        {hasFilters && <Button variant="ghost" onClick={() => { setSearch(""); setLoc(""); router.replace("/services"); }}><X className="h-4 w-4" /> Clear</Button>}
      </div>

      <div className="mt-8" aria-live="polite">
        {error ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center"><p>{error.message}</p><Button className="mt-4" onClick={reload}>Try again</Button></div>
        ) : loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}</div>
        ) : data?.items?.length ? (
          <>
            <p className="mb-4 text-sm text-muted-foreground">{data.total} service{data.total === 1 ? "" : "s"} found</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.items.map((s) => <ServiceCard key={s._id} service={s} />)}</div>
            <Pagination page={data.page} pages={data.pages} onChange={(p) => set({ page: p })} />
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-14 text-center">
            <SearchX className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-3 text-2xl font-semibold">No services match your search</h2>
            <p className="mt-1 text-muted-foreground">Try a different keyword, or clear the filters to see everything.</p>
          </div>
        )}
      </div>
    </div>
  );
}

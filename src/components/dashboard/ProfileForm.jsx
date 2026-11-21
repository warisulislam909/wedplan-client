"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/skeleton";
import ImageUploader from "@/components/services/ImageUploader";
import { PageHeader, ErrorState } from "./parts";

export default function ProfileForm() {
  const { refetch } = useSession();
  const { data: me, loading, error, reload } = useApi("/me");
  const [form, setForm] = useState({ name: "", phone: "", businessName: "" });
  const [image, setImage] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (me) { setForm({ name: me.name, phone: me.phone || "", businessName: me.businessName || "" }); setImage(me.image ? [me.image] : []); }
  }, [me]);

  if (loading) return <Spinner />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  async function save(e) {
    e.preventDefault();
    const errs = {};
    if (form.name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    if (form.phone && !/^[+\d][\d\s-]{6,18}$/.test(form.phone)) errs.phone = "Enter a valid phone number";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    try {
      // role / subscription এই payload এ পাঠানো হয় না, server ও ignore করে
      await api("/me", { method: "PATCH", body: { name: form.name, phone: form.phone, image: image[0] || "", ...(me.role === "vendor" ? { businessName: form.businessName } : {}) } });
      await refetch();
      toast.success("Profile updated");
    } catch (err) { toast.error(err.message); } finally { setSaving(false); }
  }

  return (
    <>
      <PageHeader title="Profile settings" subtitle="Update how you appear on WedPlan." />
      <Card className="max-w-2xl"><CardContent>
        <form onSubmit={save} className="space-y-5" noValidate>
          <Field label="Profile image"><ImageUploader value={image} onChange={setImage} max={1} label="Upload" /></Field>
          <Field label="Full name" error={errors.name}><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Email" hint="Email can’t be changed here"><Input value={me.email} disabled /></Field>
          <Field label="Phone" error={errors.phone}><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+880 1XXX-XXXXXX" /></Field>
          {me.role === "vendor" && <Field label="Business name"><Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} placeholder="e.g. Rose & Ivory Studio" /></Field>}
          <Button type="submit" loading={saving}>Save changes</Button>
        </form>
      </CardContent></Card>
    </>
  );
}

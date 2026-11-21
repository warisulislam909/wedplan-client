"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Store, Heart } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import GoogleButton from "@/components/layout/GoogleButton";
import ImageUploader from "@/components/services/ImageUploader";
import { PASSWORD_RULE, cn } from "@/lib/utils";

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState("customer");
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  async function onSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = f.get("name").trim(), email = f.get("email").trim(), password = f.get("password");
    const errs = {};
    if (name.length < 2) errs.name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email address";
    if (!PASSWORD_RULE.test(password)) errs.password = "Use 6+ characters with at least one uppercase and one lowercase letter";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    const { error } = await signUp.email({ name, email, password, image: image[0] || undefined, role });
    setLoading(false);
    if (error) return toast.error(error.message || "Could not create your account");
    toast.success("Account created. Welcome to WedPlan!");
    router.push("/dashboard");
    router.refresh();
  }

  const roleBtn = (value, Icon, title, text) => (
    <button type="button" onClick={() => setRole(value)} aria-pressed={role === value}
      className={cn("flex flex-1 flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors", role === value ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted")}>
      <Icon className="h-5 w-5 text-primary" /><span className="text-sm font-semibold">{title}</span><span className="text-xs text-muted-foreground">{text}</span>
    </button>
  );

  return (
    <div className="container flex justify-center py-12">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8">
        <h1 className="text-4xl font-semibold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose how you’ll use WedPlan.</p>
        <div className="mt-5 flex gap-3">
          {roleBtn("customer", Heart, "Customer", "Find and book vendors")}
          {roleBtn("vendor", Store, "Vendor", "List my wedding services")}
        </div>
        <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
          <Field label="Full name" error={errors.name}><Input name="name" autoComplete="name" /></Field>
          <Field label="Email" error={errors.email}><Input name="email" type="email" autoComplete="email" /></Field>
          <Field label="Password" error={errors.password} hint="At least 6 characters, with one uppercase and one lowercase letter"><Input name="password" type="password" autoComplete="new-password" /></Field>
          <Field label="Profile image (optional)"><ImageUploader value={image} onChange={setImage} max={1} label="Upload" /></Field>
          <Button type="submit" className="w-full" loading={loading}>Create account</Button>
        </form>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
        <GoogleButton role={role} label={`Sign up as ${role} with Google`} />
        <p className="mt-6 text-center text-sm text-muted-foreground">Already registered? <Link href="/signin" className="font-medium text-primary hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}

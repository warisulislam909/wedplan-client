"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import GoogleButton from "@/components/layout/GoogleButton";

const safe = (r) => (r && r.startsWith("/") && !r.startsWith("//") ? r : "/dashboard");

function SignInForm() {
  const router = useRouter();
  const redirect = safe(useSearchParams().get("redirect"));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  async function onSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = f.get("email").trim(), password = f.get("password");
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email address";
    if (!password) errs.password = "Enter your password";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    const { error } = await signIn.email({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message || "Incorrect email or password");
    toast.success("Welcome back!");
    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8">
        <h1 className="text-4xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back to WedPlan.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <Field label="Email" error={errors.email}><Input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></Field>
          <Field label="Password" error={errors.password}><Input name="password" type="password" autoComplete="current-password" /></Field>
          <Button type="submit" className="w-full" loading={loading}>Sign in</Button>
        </form>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
        <GoogleButton callbackURL={redirect} />
        <p className="mt-6 text-center text-sm text-muted-foreground">New to WedPlan? <Link href="/signup" className="font-medium text-primary hover:underline">Create an account</Link></p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return <Suspense><SignInForm /></Suspense>;
}

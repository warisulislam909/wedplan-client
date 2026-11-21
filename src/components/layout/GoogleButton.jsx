"use client";
import { useState } from "react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function GoogleButton({ role, callbackURL = "/dashboard", label = "Continue with Google" }) {
  const [loading, setLoading] = useState(false);
  async function go() {
    setLoading(true);
    // নতুন Google ইউজারের role সার্ভার hook এ এই cookie থেকে নেওয়া হয় (admin কখনো নয়)
    if (role) document.cookie = `wp_signup_role=${role}; path=/; max-age=600; SameSite=Lax`;
    const { error } = await signIn.social({ provider: "google", callbackURL });
    if (error) { toast.error(error.message || "Google sign-in failed"); setLoading(false); }
  }
  return (
    <Button type="button" variant="outline" className="w-full" loading={loading} onClick={go}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2-1.9 3.3-4.7 3.3-8.1z"/><path fill="#34A853" d="M12 23c3 0 5.4-1 7.2-2.7l-3.5-2.7c-1 .7-2.2 1-3.7 1-2.8 0-5.2-1.9-6-4.5H2.4v2.8A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M6 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.4a11 11 0 0 0 0 9.8L6 14.1z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.6l3.1-3.1A11 11 0 0 0 2.4 7.1L6 9.9c.8-2.6 3.2-4.5 6-4.5z"/></svg>
      {label}
    </Button>
  );
}

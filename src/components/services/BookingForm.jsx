"use client";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";

export default function BookingForm({ serviceId, onDone }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().slice(0, 10);

  async function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const eventDate = f.get("eventDate"), eventLocation = f.get("eventLocation").trim(), message = f.get("message").trim();
    const errs = {};
    if (!eventDate || eventDate < today) errs.eventDate = "Choose today or a future date";
    if (eventLocation.length < 2) errs.eventLocation = "Enter the event location";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      await api("/bookings", { method: "POST", body: { serviceId, eventDate, eventLocation, message } });
      toast.success("Booking request sent. The vendor will review it.");
      onDone?.();
    } catch (err) { toast.error(err.message); } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Field label="Event date" error={errors.eventDate}><Input type="date" name="eventDate" min={today} /></Field>
      <Field label="Event location" error={errors.eventLocation}><Input name="eventLocation" placeholder="Venue or city" /></Field>
      <Field label="Additional message (optional)"><Textarea name="message" maxLength={1000} placeholder="Guest count, preferred style, questions…" /></Field>
      <Button type="submit" className="w-full" loading={loading}>Send booking request</Button>
    </form>
  );
}

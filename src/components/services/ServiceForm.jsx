"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import ImageUploader from "./ImageUploader";
import { CATEGORY_NAMES } from "@/lib/constants";

export default function ServiceForm({ initial, onSubmit, submitLabel = "Save service", submitting }) {
  const [f, setF] = useState({ serviceName: "", category: "", description: "", price: "", location: "", images: [], ...initial });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  function submit(e) {
    e.preventDefault();
    const errs = {};
    if (f.serviceName.trim().length < 2) errs.serviceName = "Enter a service name";
    if (!f.category) errs.category = "Choose a category";
    if (f.description.trim().length < 10) errs.description = "Describe the service in at least 10 characters";
    if (!(Number(f.price) > 0)) errs.price = "Enter a price greater than 0";
    if (f.location.trim().length < 2) errs.location = "Enter a location";
    if (!f.images.length) errs.images = "Upload at least one image";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit({ ...f, price: Number(f.price) });
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <Field label="Service name" error={errors.serviceName}><Input value={f.serviceName} onChange={set("serviceName")} /></Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Category" error={errors.category}>
          <Select value={f.category} onChange={set("category")}><option value="">Select category</option>{CATEGORY_NAMES.map((c) => <option key={c}>{c}</option>)}</Select>
        </Field>
        <Field label="Price (USD)" error={errors.price}><Input type="number" min="1" value={f.price} onChange={set("price")} /></Field>
      </div>
      <Field label="Location" error={errors.location}><Input value={f.location} onChange={set("location")} placeholder="City or area" /></Field>
      <Field label="Description" error={errors.description}><Textarea rows={5} value={f.description} onChange={set("description")} /></Field>
      <Field label="Service images" error={errors.images} hint="Up to 4 images. The first one is the cover."><ImageUploader value={f.images} onChange={(images) => setF({ ...f, images })} max={4} /></Field>
      <Button type="submit" loading={submitting}>{submitLabel}</Button>
    </form>
  );
}

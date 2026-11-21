import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs));

export const formatPrice = (n, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n || 0);

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "—";

export const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
export const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

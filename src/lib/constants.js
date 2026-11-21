import { Camera, Landmark, Flower2, UtensilsCrossed, Sparkles, Shirt } from "lucide-react";

export const CATEGORIES = [
  { name: "Photography & Videography", icon: Camera, blurb: "Stories told in frames" },
  { name: "Wedding Venues", icon: Landmark, blurb: "Gardens, halls, palaces" },
  { name: "Decoration & Florist", icon: Flower2, blurb: "Stages, blooms, lighting" },
  { name: "Catering Services", icon: UtensilsCrossed, blurb: "Menus for every guest" },
  { name: "Makeup & Styling", icon: Sparkles, blurb: "Bridal looks that last" },
  { name: "Wedding Fashion", icon: Shirt, blurb: "Outfits made to fit" },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

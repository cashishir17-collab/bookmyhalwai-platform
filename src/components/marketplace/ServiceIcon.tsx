import {
  Building2,
  Brush,
  Camera,
  Flame,
  Flower2,
  Gift,
  Music2,
  PartyPopper,
  Sparkles,
  TentTree,
  UtensilsCrossed,
} from "lucide-react";

const serviceIcons = {
  building: Building2,
  camera: Camera,
  flame: Flame,
  flower: Flower2,
  gift: Gift,
  brush: Brush,
  music: Music2,
  party: PartyPopper,
  sparkles: Sparkles,
  tent: TentTree,
  utensils: UtensilsCrossed,
};

interface ServiceIconProps {
  name: keyof typeof serviceIcons;
  className?: string;
}

export function ServiceIcon({ name, className = "h-6 w-6" }: ServiceIconProps) {
  const Icon = serviceIcons[name];
  return <Icon className={className} aria-hidden="true" />;
}

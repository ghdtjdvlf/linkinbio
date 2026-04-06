import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: { px: 32, cls: "h-8 w-8 text-sm" },
  md: { px: 48, cls: "h-12 w-12 text-base" },
  lg: { px: 80, cls: "h-20 w-20 text-2xl" },
  xl: { px: 112, cls: "h-28 w-28 text-3xl" },
};

export default function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const { px, cls } = sizes[size];
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  if (src) {
    return (
      <div className={cn("relative overflow-hidden rounded-full", cls, className)}>
        <Image src={src} alt={name ?? "avatar"} width={px} height={px} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700",
        cls,
        className
      )}
    >
      {initials}
    </div>
  );
}

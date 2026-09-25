import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  size = 36,
  title = "KT",
}: {
  className?: string;
  size?: number;
  title?: string;
}) {
  return (
    <Image
      src="/brand/logo.png"
      alt={title}
      width={size}
      height={size}
      className={cn("rounded-[22%] shadow-sm", className)}
      priority
    />
  );
}

export function BrandMark({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src="/brand/logo-mark.svg"
      alt=""
      width={size}
      height={Math.round(size * 1.14)}
      className={cn(className)}
      aria-hidden
    />
  );
}

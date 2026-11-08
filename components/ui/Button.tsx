"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const base =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "btn-shine bg-gold-fade text-ink px-8 py-4 text-base shadow-gold hover:brightness-105",
  secondary:
    "border border-gold/40 text-paper px-8 py-4 text-base hover:border-gold hover:bg-white/5",
  ghost: "text-mist px-4 py-2 text-sm hover:text-paper",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return <button ref={ref} className={cn(base, variants[variant], className)} {...props} />;
  },
);

Button.displayName = "Button";

export default Button;

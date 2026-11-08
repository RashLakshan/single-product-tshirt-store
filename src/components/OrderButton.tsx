"use client";

import type { ButtonHTMLAttributes } from "react";
import { useOrder } from "@/components/OrderProvider";
import { ArrowUpRight, WhatsAppIcon } from "@/components/icons";
import { cn } from "@/lib/site";

type OrderButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: "primary" | "light" | "outline" | "text";
  icon?: "arrow" | "whatsapp" | "none";
  fullWidth?: boolean;
};

export function OrderButton({
  label,
  variant = "primary",
  icon = "arrow",
  fullWidth = false,
  className,
  type = "button",
  onClick,
  ...props
}: OrderButtonProps) {
  const { openOrder } = useOrder();

  return (
    <button
      type={type}
      className={cn(
        "button",
        `button--${variant}`,
        fullWidth && "button--full",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          openOrder();
        }
      }}
      data-order-trigger
      {...props}
    >
      <span>{label}</span>
      {icon === "arrow" ? (
        <ArrowUpRight className="button__icon" aria-hidden="true" />
      ) : null}
      {icon === "whatsapp" ? (
        <WhatsAppIcon className="button__icon" aria-hidden="true" />
      ) : null}
    </button>
  );
}

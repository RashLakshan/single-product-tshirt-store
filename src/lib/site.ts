import { siteConfig } from "@/config/site";

export function formatPrice(value: number, options?: { showCode?: boolean }) {
  const formatted = new Intl.NumberFormat(siteConfig.currency.locale, {
    style: "currency",
    currency: siteConfig.currency.code,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

  return options?.showCode ? `${formatted} ${siteConfig.currency.code}` : formatted;
}

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function getGeneralWhatsAppUrl() {
  return buildWhatsAppUrl(siteConfig.whatsapp.supportMessage);
}

export function getShippingEstimate() {
  if (
    siteConfig.shipping.mode === "flat" &&
    siteConfig.shipping.flatRate !== null &&
    Number.isFinite(siteConfig.shipping.flatRate) &&
    siteConfig.shipping.flatRate > 0
  ) {
    return siteConfig.shipping.flatRate;
  }

  return null;
}

export function buildWhatsAppUrl(message: string) {
  const number = siteConfig.whatsapp.number.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl, formatPrice, getShippingEstimate } from "@/lib/site";

export type OrderValues = {
  size: string;
  color: string;
  quantity: number;
  fullName: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  email: string;
  notes: string;
};

export type OrderField = keyof OrderValues;
export type OrderErrors = Partial<Record<OrderField, string>>;

export const initialOrderValues: OrderValues = {
  size: "",
  color: siteConfig.product.colors[0]?.name ?? "",
  quantity: 1,
  fullName: "",
  country: "",
  city: "",
  address: "",
  postalCode: "",
  email: "",
  notes: "",
};

export function validateOrder(values: OrderValues): OrderErrors {
  const errors: OrderErrors = {};

  const availableSizes = siteConfig.product.sizes
    .filter((size) => size.available)
    .map((size) => size.label);

  if (!values.size) {
    errors.size = "Please choose a size.";
  } else if (!availableSizes.includes(values.size)) {
    errors.size = "That size is not currently available.";
  }

  if (!values.color) {
    errors.color = "Please choose a colour.";
  } else if (!siteConfig.product.colors.some((color) => color.name === values.color)) {
    errors.color = "That colour is not currently available.";
  }

  if (!Number.isInteger(values.quantity) || values.quantity < 1 || values.quantity > 10) {
    errors.quantity = "Choose a quantity between 1 and 10.";
  }

  const fullName = values.fullName.trim();
  if (fullName.length < 2) {
    errors.fullName = "Please enter your full name.";
  } else if (fullName.length > 100) {
    errors.fullName = "Please keep your name under 100 characters.";
  }

  if (!values.country) {
    errors.country = "Please select your country.";
  } else if (!(siteConfig.countries as readonly string[]).includes(values.country)) {
    errors.country = "Please choose a country from the list.";
  }

  const city = values.city.trim();
  if (city.length < 2) {
    errors.city = "Please enter your city.";
  } else if (city.length > 80) {
    errors.city = "Please keep the city name under 80 characters.";
  }

  const address = values.address.trim();
  if (address.length < 5) {
    errors.address = "Please enter your delivery address.";
  } else if (address.length > 300) {
    errors.address = "Please keep the address under 300 characters.";
  }

  const postal = values.postalCode.trim();
  if (postal.length < 2) {
    errors.postalCode = "Please enter your postal code.";
  } else if (postal.length > 16) {
    errors.postalCode = "Please check your postal code.";
  } else if (!/^[A-Za-z0-9][A-Za-z0-9\s-]*$/.test(postal)) {
    errors.postalCode = "Use letters, numbers, spaces or hyphens only.";
  }

  const email = values.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = "Please enter a valid email address, or leave it blank.";
  }

  if (values.notes.trim().length > 500) {
    errors.notes = "Please keep notes under 500 characters.";
  }

  return errors;
}

export function buildOrderMessage(values: OrderValues) {
  const product = siteConfig.product;
  const priceConfigured = Number.isFinite(product.price) && product.price > 0;
  const subtotal = values.quantity * product.price;
  const shippingEstimate = getShippingEstimate();

  const lines = [
    "Hello AUREL, I would like to order the following:",
    "",
    `Product: ${product.name} — ${product.edition}`,
    `Size: ${values.size}`,
    `Colour: ${values.color}`,
    `Quantity: ${values.quantity}`,
  ];

  if (priceConfigured) {
    lines.push(
      `Price: ${formatPrice(product.price, { showCode: true })} each`,
      `Estimated product total: ${formatPrice(subtotal, { showCode: true })}`,
    );

    if (shippingEstimate !== null) {
      lines.push(
        `Shipping estimate: ${formatPrice(shippingEstimate, { showCode: true })}`,
        `Estimated total including shipping: ${formatPrice(subtotal + shippingEstimate, {
          showCode: true,
        })}`,
        "Final shipping and total are confirmed by the studio.",
      );
    } else {
      lines.push("Shipping: to be confirmed separately");
    }
  }

  lines.push(
    "",
    "Customer details",
    `Customer Name: ${values.fullName.trim()}`,
    `Country: ${values.country}`,
    `City: ${values.city.trim()}`,
    `Address: ${values.address.trim()}`,
    `Postal Code: ${values.postalCode.trim()}`,
  );

  if (values.email.trim()) {
    lines.push(`Email: ${values.email.trim()}`);
  }

  if (values.notes.trim()) {
    lines.push(`Notes: ${values.notes.trim()}`);
  }

  lines.push(
    "",
    "Please confirm availability, shipping cost, and payment instructions.",
    "This is an order enquiry only and is not confirmed until the studio replies.",
  );

  return lines.join("\n");
}

export function createWhatsAppOrderUrl(values: OrderValues) {
  return buildWhatsAppUrl(buildOrderMessage(values));
}

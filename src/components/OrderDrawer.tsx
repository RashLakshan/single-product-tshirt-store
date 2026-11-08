"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { siteConfig } from "@/config/site";
import { useDialog } from "@/components/useDialog";
import { useOrder } from "@/components/OrderProvider";
import {
  CloseIcon,
  MinusIcon,
  PlusIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { formatPrice, getShippingEstimate, withBasePath } from "@/lib/site";
import {
  createWhatsAppOrderUrl,
  initialOrderValues,
  validateOrder,
  type OrderErrors,
  type OrderField,
  type OrderValues,
} from "@/lib/order";

type SubmittedState = {
  url: string;
} | null;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="field__error" id={id} role="alert">
      {message}
    </p>
  );
}

export function OrderDrawer() {
  const {
    isOrderOpen,
    closeOrder,
    selectedSize,
    selectedColor,
    quantity,
    setSelectedSize,
    setSelectedColor,
    setQuantity,
  } = useOrder();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<OrderValues>(initialOrderValues);
  const [errors, setErrors] = useState<OrderErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState<SubmittedState>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const panelRef = useDialog(isOrderOpen, closeOrder);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOrderOpen) return;

    setForm((current) => ({
      ...current,
      size: selectedSize,
      color: selectedColor,
      quantity,
    }));
    setErrors({});
    setAttempted(false);
    setSubmitted(null);
    // Sync only when the drawer opens; in-drawer edits manage their own state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOrderOpen]);

  useEffect(() => {
    if (!attempted || Object.keys(errors).length === 0) return;
    const firstInvalid = formRef.current?.querySelector<HTMLElement>(
      '[aria-invalid="true"], [data-invalid="true"]',
    );
    firstInvalid?.focus({ preventScroll: false });
  }, [attempted, errors]);

  useEffect(() => {
    if (submitted) {
      statusRef.current?.focus({ preventScroll: true });
    }
  }, [submitted]);

  const total = form.quantity * siteConfig.product.price;
  const shippingEstimate = getShippingEstimate();
  const estimatedTotal = total + (shippingEstimate ?? 0);
  const color = useMemo(
    () => siteConfig.product.colors.find((entry) => entry.name === form.color),
    [form.color],
  );

  if (!mounted) return null;

  function updateField<K extends OrderField>(field: K, value: OrderValues[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setSubmitted(null);
  }

  function handleSizeChange(size: string) {
    updateField("size", size);
    setSelectedSize(size);
  }

  function handleColorChange(colorName: string) {
    updateField("color", colorName);
    setSelectedColor(colorName);
  }

  function handleQuantityChange(nextQuantity: number) {
    const value = Number.isNaN(nextQuantity) ? 1 : Math.min(10, Math.max(1, nextQuantity));
    updateField("quantity", value);
    setQuantity(value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    const nextErrors = validateOrder(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const url = createWhatsAppOrderUrl(form);
    setSubmitted({ url });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function reopenWhatsApp() {
    if (!submitted) return;
    window.open(submitted.url, "_blank", "noopener,noreferrer");
  }

  if (!isOrderOpen) return null;

  return createPortal(
    <div className="dialog-layer" data-open="true">
      <button
        type="button"
        className="dialog-backdrop"
        aria-label="Close order form"
        tabIndex={-1}
        onClick={closeOrder}
      />
      <div
        className="order-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-title"
        ref={panelRef}
        tabIndex={-1}
      >
        <div className="order-drawer__header">
          <div>
            <p className="eyebrow">Order enquiry / {siteConfig.product.edition}</p>
            <h2 id="order-title">{submitted ? "One last step." : "Order via WhatsApp"}</h2>
          </div>
          <button
            type="button"
            className="icon-button icon-button--dark"
            aria-label="Close order form"
            onClick={closeOrder}
            data-autofocus
          >
            <CloseIcon />
          </button>
        </div>

        {submitted ? (
          <div className="order-success" ref={statusRef} tabIndex={-1}>
            <div className="order-success__mark" aria-hidden="true">
              <WhatsAppIcon />
            </div>
            <p className="eyebrow">Not confirmed yet</p>
            <h3>Send the message in WhatsApp.</h3>
            <p>
              WhatsApp should open in a new tab with your order details prepared. Press send
              to begin the conversation with the studio.
            </p>
            <ol className="order-success__steps">
              <li>
                <span>01</span>
                Send the prepared message.
              </li>
              <li>
                <span>02</span>
                We confirm availability, shipping cost and the final total.
              </li>
              <li>
                <span>03</span>
                Payment instructions follow only after you confirm.
              </li>
            </ol>
            <div className="order-success__actions">
              <button type="button" className="button button--primary button--full" onClick={reopenWhatsApp}>
                <span>Open WhatsApp again</span>
                <WhatsAppIcon className="button__icon" aria-hidden="true" />
              </button>
              <a className="button button--outline button--full" href={submitted.url} target="_blank" rel="noopener noreferrer">
                <span>Use a direct link instead</span>
              </a>
              <button type="button" className="text-button" onClick={() => setSubmitted(null)}>
                Back to my details
              </button>
            </div>
            <p className="microcopy">
              Your order is only confirmed after the studio replies. No payment is collected on
              this website.
            </p>
          </div>
        ) : (
          <form className="order-form" ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="order-form__intro">
              <p>
                This creates a WhatsApp message. The studio confirms availability, shipping and
                payment with you before anything is final.
              </p>
              <p className="microcopy">* Required</p>
            </div>

            <fieldset className="form-section">
              <legend className="form-section__title">
                <span>01</span> Your piece
              </legend>

              <div className="form-group" data-invalid={Boolean(errors.color)}>
                <span className="field__label">Colour</span>
                <div className="swatch-row" role="radiogroup" aria-label="Colour" aria-required="true">
                  {siteConfig.product.colors.map((entry) => (
                    <label
                      key={entry.name}
                      className={`swatch-option${form.color === entry.name ? " is-selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="colour"
                        value={entry.name}
                        checked={form.color === entry.name}
                        onChange={() => handleColorChange(entry.name)}
                        aria-describedby={errors.color ? "order-color-error" : undefined}
                        aria-invalid={Boolean(errors.color)}
                      />
                      <span
                        className="swatch-option__dot"
                        style={{ backgroundColor: entry.hex }}
                        aria-hidden="true"
                      />
                      <span>{entry.name}</span>
                    </label>
                  ))}
                </div>
                <FieldError id="order-color-error" message={errors.color} />
              </div>

              <div className="form-group" data-invalid={Boolean(errors.size)}>
                <div className="field__label-row">
                  <span className="field__label">Size</span>
                  <a href={withBasePath("/#size-guide")} className="inline-link" onClick={closeOrder}>
                    Size guide
                  </a>
                </div>
                <div className="size-row" role="radiogroup" aria-label="Size" aria-required="true">
                  {siteConfig.product.sizes.map((size) => (
                    <label
                      key={size.label}
                      className={`size-option${form.size === size.label ? " is-selected" : ""}${
                        !size.available ? " is-disabled" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="size"
                        value={size.label}
                        checked={form.size === size.label}
                        disabled={!size.available}
                        required
                        onChange={() => handleSizeChange(size.label)}
                        aria-describedby={errors.size ? "order-size-error" : undefined}
                        aria-invalid={Boolean(errors.size)}
                      />
                      <span>{size.label}</span>
                      {!size.available ? <small>Waitlist</small> : null}
                    </label>
                  ))}
                </div>
                <FieldError id="order-size-error" message={errors.size} />
              </div>

              <div className="form-group form-group--quantity">
                <span className="field__label">Quantity</span>
                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(form.quantity - 1)}
                    disabled={form.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon />
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={10}
                    step={1}
                    value={form.quantity}
                    aria-label="Quantity"
                    aria-invalid={Boolean(errors.quantity)}
                    aria-describedby={errors.quantity ? "order-quantity-error" : undefined}
                    onChange={(event) =>
                      handleQuantityChange(Number.parseInt(event.target.value || "1", 10))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(form.quantity + 1)}
                    disabled={form.quantity >= 10}
                    aria-label="Increase quantity"
                  >
                    <PlusIcon />
                  </button>
                </div>
                <FieldError id="order-quantity-error" message={errors.quantity} />
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend className="form-section__title">
                <span>02</span> Delivery details
              </legend>

              <div className="form-field">
                <label htmlFor="order-name">Full name</label>
                <input
                  id="order-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.fullName}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? "order-name-error" : undefined}
                  onChange={(event) => updateField("fullName", event.target.value)}
                />
                <FieldError id="order-name-error" message={errors.fullName} />
              </div>

              <div className="form-field">
                <label htmlFor="order-country">Country</label>
                <div className="select-wrap">
                  <select
                    id="order-country"
                    name="country"
                    autoComplete="country-name"
                    required
                    value={form.country}
                    aria-invalid={Boolean(errors.country)}
                    aria-describedby={errors.country ? "order-country-error" : undefined}
                    onChange={(event) => updateField("country", event.target.value)}
                  >
                    <option value="">Select a country</option>
                    {siteConfig.countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <FieldError id="order-country-error" message={errors.country} />
              </div>

              <div className="form-field-grid">
                <div className="form-field">
                  <label htmlFor="order-city">City</label>
                  <input
                    id="order-city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    required
                    value={form.city}
                    aria-invalid={Boolean(errors.city)}
                    aria-describedby={errors.city ? "order-city-error" : undefined}
                    onChange={(event) => updateField("city", event.target.value)}
                  />
                  <FieldError id="order-city-error" message={errors.city} />
                </div>
                <div className="form-field">
                  <label htmlFor="order-postal">Postal code</label>
                  <input
                    id="order-postal"
                    name="postalCode"
                    type="text"
                    autoComplete="postal-code"
                    required
                    value={form.postalCode}
                    aria-invalid={Boolean(errors.postalCode)}
                    aria-describedby={errors.postalCode ? "order-postal-error" : undefined}
                    onChange={(event) => updateField("postalCode", event.target.value)}
                  />
                  <FieldError id="order-postal-error" message={errors.postalCode} />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="order-address">Delivery address</label>
                <textarea
                  id="order-address"
                  name="address"
                  rows={2}
                  autoComplete="street-address"
                  required
                  value={form.address}
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? "order-address-error" : undefined}
                  onChange={(event) => updateField("address", event.target.value)}
                />
                <FieldError id="order-address-error" message={errors.address} />
              </div>

              <div className="form-field">
                <label htmlFor="order-email">
                  Email <span className="optional">optional</span>
                </label>
                <input
                  id="order-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={form.email}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "order-email-error" : undefined}
                  onChange={(event) => updateField("email", event.target.value)}
                />
                <FieldError id="order-email-error" message={errors.email} />
              </div>

              <div className="form-field">
                <label htmlFor="order-notes">
                  Additional notes <span className="optional">optional</span>
                </label>
                <textarea
                  id="order-notes"
                  name="notes"
                  rows={3}
                  maxLength={500}
                  placeholder="Fit questions, delivery notes, gift request…"
                  value={form.notes}
                  aria-invalid={Boolean(errors.notes)}
                  aria-describedby={errors.notes ? "order-notes-error" : undefined}
                  onChange={(event) => updateField("notes", event.target.value)}
                />
                <FieldError id="order-notes-error" message={errors.notes} />
              </div>
            </fieldset>

            <div className="order-summary">
              <p className="eyebrow">Your selection</p>
              <div className="order-summary__product">
                <div className="order-summary__name">
                  <strong>{siteConfig.product.name}</strong>
                  <span>
                    {form.size ? `Size ${form.size}` : "Size not selected"} ·{" "}
                    {color?.name ?? "Colour not selected"} · Qty {form.quantity}
                  </span>
                </div>
                <span>{formatPrice(total, { showCode: true })}</span>
              </div>
              <div className="order-summary__row">
                <span>Product subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="order-summary__row">
                <span>{shippingEstimate !== null ? siteConfig.shipping.estimateLabel : "Shipping"}</span>
                <span>
                  {shippingEstimate !== null
                    ? formatPrice(shippingEstimate, { showCode: true })
                    : siteConfig.shipping.manualLabel}
                </span>
              </div>
              {shippingEstimate !== null ? (
                <div className="order-summary__row order-summary__row--total">
                  <span>Estimated total</span>
                  <span>{formatPrice(estimatedTotal, { showCode: true })}</span>
                </div>
              ) : null}
              <p className="microcopy">
                Shipping is quoted separately for your destination. No payment is taken on this
                site.
              </p>
            </div>

            {attempted && Object.keys(errors).length > 0 ? (
              <p className="form-alert" role="alert">
                Please check the highlighted fields before continuing.
              </p>
            ) : null}

            <button type="submit" className="button button--primary button--full order-submit">
              <span>ORDER VIA WHATSAPP</span>
              <WhatsAppIcon className="button__icon" aria-hidden="true" />
            </button>
            <p className="form-consent">
              By continuing, your details will be included in a WhatsApp message to the studio.
              Read the <a href={withBasePath("/policies/privacy/")}>privacy policy</a>. You will be able to review
              the message before sending.
            </p>
            <p className="sr-only" aria-live="polite">
              {Object.keys(errors).length > 0
                ? `There are ${Object.keys(errors).length} fields to check: ${Object.values(
                    errors,
                  ).join(" ")}`
                : ""}
            </p>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}

"use client";

import { siteConfig } from "@/config/site";
import { useOrder } from "@/components/OrderProvider";
import { ArrowUpRight, MinusIcon, PlusIcon, WhatsAppIcon } from "@/components/icons";
import { formatPrice, getShippingEstimate } from "@/lib/site";

function DetailsRow({
  title,
  status,
  children,
}: {
  title: string;
  status?: string;
  children: React.ReactNode;
}) {
  return (
    <details className="product-detail">
      <summary>
        <span>{title}</span>
        <span className="product-detail__meta">
          {status ? <small>{status}</small> : null}
          <PlusIcon className="product-detail__plus" />
        </span>
      </summary>
      <div className="product-detail__body">{children}</div>
    </details>
  );
}

export function ProductPanel() {
  const {
    selectedSize,
    selectedColor,
    quantity,
    setSelectedSize,
    setSelectedColor,
    setQuantity,
    openOrder,
  } = useOrder();

  const color = siteConfig.product.colors.find((entry) => entry.name === selectedColor);
  const subtotal = siteConfig.product.price * quantity;
  const shippingEstimate = getShippingEstimate();
  const estimatedTotal = subtotal + (shippingEstimate ?? 0);

  return (
    <div className="product-panel">
      <div className="product-panel__top">
        <p className="eyebrow">
          {siteConfig.product.edition} / Graphic study
        </p>
        <h3>{siteConfig.product.name}</h3>
        <div className="product-panel__price-row">
          <span className="product-price">{formatPrice(siteConfig.product.price, { showCode: true })}</span>
          <span className="product-panel__price-note">Shipping confirmed separately</span>
        </div>
        <p className="product-panel__description">{siteConfig.product.description}</p>
      </div>

      <div className="product-panel__option">
        <div className="option-heading">
          <span className="field__label">Colour</span>
          <span className="option-heading__value">
            {color?.name}
            {color?.note ? <em> — {color.note}</em> : null}
          </span>
        </div>
        <div className="color-row" role="radiogroup" aria-label="Colour">
          {siteConfig.product.colors.map((entry) => (
            <label
              key={entry.name}
              className={`color-swatch${selectedColor === entry.name ? " is-selected" : ""}`}
            >
              <input
                type="radio"
                name="product-colour"
                value={entry.name}
                checked={selectedColor === entry.name}
                onChange={() => setSelectedColor(entry.name)}
                aria-label={`${entry.name}${entry.note ? ` — ${entry.note}` : ""}`}
              />
              <span
                className="color-swatch__disc"
                style={{ backgroundColor: entry.hex }}
                aria-hidden="true"
              />
            </label>
          ))}
        </div>
        <p className="option-hint">Studio images are shown in Bone. Ask us for colour references before ordering.</p>
      </div>

      <div className="product-panel__option">
        <div className="option-heading">
          <span className="field__label">Size</span>
          <a className="inline-link" href="#size-guide">
            Size guide <ArrowUpRight />
          </a>
        </div>
        <div className="size-picker" role="radiogroup" aria-label="Size">
          {siteConfig.product.sizes.map((size) => (
            <label
              key={size.label}
              className={`size-pill${selectedSize === size.label ? " is-selected" : ""}${
                !size.available ? " is-disabled" : ""
              }`}
            >
              <input
                type="radio"
                name="product-size"
                value={size.label}
                checked={selectedSize === size.label}
                disabled={!size.available}
                onChange={() => setSelectedSize(size.label)}
              />
              <span>{size.label}</span>
            </label>
          ))}
        </div>
        <p className="option-hint">
          {selectedSize
            ? `Size ${selectedSize} selected. Availability confirmed on WhatsApp.`
            : "Select your size. Our team confirms availability before payment."}
        </p>
      </div>

      <div className="product-panel__option product-panel__quantity">
        <span className="field__label">Quantity</span>
        <div className="quantity-control quantity-control--product">
          <button
            type="button"
            onClick={() => setQuantity(quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <MinusIcon />
          </button>
          <span aria-live="polite">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            disabled={quantity >= 10}
            aria-label="Increase quantity"
          >
            <PlusIcon />
          </button>
        </div>
      </div>

      <div className="product-panel__purchase">
        <div className="product-panel__subtotal">
          <span>Product subtotal</span>
          <strong>{formatPrice(subtotal, { showCode: true })}</strong>
        </div>
        {shippingEstimate !== null ? (
          <>
            <div className="product-panel__subtotal product-panel__subtotal--minor">
              <span>{siteConfig.shipping.estimateLabel}</span>
              <span>{formatPrice(shippingEstimate, { showCode: true })}</span>
            </div>
            <div className="product-panel__subtotal product-panel__subtotal--total">
              <span>Estimated total</span>
              <strong>{formatPrice(estimatedTotal, { showCode: true })}</strong>
            </div>
          </>
        ) : null}
        <button
          type="button"
          className="button button--primary button--full product-order"
          onClick={() => openOrder()}
          data-order-trigger
        >
          <span>ORDER VIA WHATSAPP</span>
          <WhatsAppIcon className="button__icon" aria-hidden="true" />
        </button>
        <p className="microcopy product-panel__microcopy">
          Opens WhatsApp with your selection. The order is finalised only after the studio
          confirms availability, shipping and payment. No payment is taken here.
        </p>
      </div>

      <div className="product-panel__details">
        <p className="eyebrow">The specifics</p>
        <DetailsRow
          title="Material"
          status={siteConfig.product.material.value ? undefined : siteConfig.product.material.status}
        >
          <p>{siteConfig.product.material.value ?? siteConfig.product.material.placeholder}</p>
        </DetailsRow>
        <DetailsRow
          title="Fit"
          status={siteConfig.product.fit.value ? undefined : siteConfig.product.fit.status}
        >
          <p>{siteConfig.product.fit.value ?? siteConfig.product.fit.placeholder}</p>
        </DetailsRow>
        <DetailsRow
          title="Care"
          status={siteConfig.product.care.value ? undefined : siteConfig.product.care.status}
        >
          <p>{siteConfig.product.care.value ?? siteConfig.product.care.placeholder}</p>
        </DetailsRow>
        <DetailsRow title="Shipping & returns">
          <p>{siteConfig.product.shippingSummary}</p>
          <p>{siteConfig.product.returnsSummary}</p>
          <p className="product-detail__links">
            <a href="/policies/shipping/">Shipping policy</a>
            <a href="/policies/returns/">Returns policy</a>
          </p>
        </DetailsRow>
      </div>
    </div>
  );
}

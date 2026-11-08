import { siteConfig } from "@/config/site";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { OrderButton } from "@/components/OrderButton";
import { ArrowDown, ArrowUpRight, EclipseMark } from "@/components/icons";
import { formatPrice } from "@/lib/site";

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__lead">
        <p className="eyebrow hero__eyebrow">
          <EclipseMark className="hero__eyebrow-mark" />
          {siteConfig.product.edition} — Graphic study
        </p>
        <h1 className="hero__title" id="hero-title" aria-label={siteConfig.product.name}>
          <span className="hero__title-the">The</span>
          <span className="hero__title-main">Eclipse</span>
          <span className="hero__title-bottom">
            <span className="hero__title-serif">Tee</span>
            <span className="hero__title-index">No. 01</span>
          </span>
        </h1>

        <div className="hero__quick">
          <div className="hero__quick-price">
            <span className="eyebrow">From</span>
            <strong>{formatPrice(siteConfig.product.price, { showCode: true })}</strong>
          </div>
          <OrderButton label="Order now" variant="primary" className="hero__quick-button" />
        </div>
      </div>

      <div className="hero__visual">
        <span className="hero__visual-index" aria-hidden="true">
          01 / 05
        </span>
        <figure className="hero__figure">
          <ResponsiveImage
            name="hero"
            alt={siteConfig.product.images[0]?.alt ?? "The Eclipse Tee, front view"}
            sizes="(max-width: 900px) 100vw, 48vw"
            priority
            imgClassName="hero__image"
          />
          <figcaption className="hero__caption">
            <span>Shown in Bone</span>
            <span>Front view</span>
          </figcaption>
          <div className="hero__seal" aria-hidden="true">
            <span>AUREL</span>
            <EclipseMark />
            <span>MMXXVI</span>
          </div>
        </figure>
        <p className="hero__vertical-label" aria-hidden="true">
          Edition 01 — A study in quiet form — MMXXVI
        </p>
      </div>

      <div className="hero__details">
        <p className="hero__intro">{siteConfig.product.heroLine}</p>

        <div className="hero__price-line">
          <span className="hero__price">{formatPrice(siteConfig.product.price, { showCode: true })}</span>
          <span className="hero__price-note">Shipping confirmed separately</span>
        </div>

        <div className="hero__actions">
          <OrderButton label="GET YOUR T-SHIRT" variant="primary" className="hero__primary" />
          <a className="text-link" href="#product">
            DISCOVER MORE
            <ArrowUpRight />
          </a>
        </div>

        <ul className="hero__trust" aria-label="Ordering information">
          {siteConfig.trustPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>

      <a className="hero__scroll" href="#product" aria-label="Scroll to the product">
        <span>Scroll to discover</span>
        <ArrowDown />
      </a>
    </section>
  );
}

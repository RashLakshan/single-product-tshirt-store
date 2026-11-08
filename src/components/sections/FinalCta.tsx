import { siteConfig } from "@/config/site";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { OrderButton } from "@/components/OrderButton";
import { ArrowUpRight, EclipseMark } from "@/components/icons";
import { formatPrice, getGeneralWhatsAppUrl } from "@/lib/site";

export function FinalCta() {
  return (
    <section className="final-cta" id="order" aria-labelledby="final-title">
      <div className="final-cta__media">
        <ResponsiveImage
          name="back"
          alt={siteConfig.product.images[1]?.alt ?? "Back view of The Eclipse Tee"}
          sizes="(max-width: 900px) 100vw, 58vw"
          imgClassName="final-cta__image"
        />
        <div className="final-cta__overlay-badge">
          <EclipseMark />
          <span>{siteConfig.product.edition}</span>
        </div>
        <p className="final-cta__photo-note">AUREL / Study 01 — Bone</p>
      </div>

      <div className="final-cta__content" data-reveal>
        <p className="eyebrow eyebrow--light">The final call / Edition 01</p>
        <h2 id="final-title">
          One tee.
          <br />
          <em>Yours.</em>
        </h2>
        <p className="final-cta__description">{siteConfig.product.shortDescription}</p>
        <div className="final-cta__price">
          <span>{formatPrice(siteConfig.product.price, { showCode: true })}</span>
          <span>plus shipping, confirmed with you</span>
        </div>
        <OrderButton label="ORDER NOW" variant="light" icon="whatsapp" fullWidth className="final-cta__button" />
        <a
          className="final-cta__question"
          href={getGeneralWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ask a question first
          <ArrowUpRight />
        </a>
        <div className="final-cta__fineprint">
          <span>Order enquiry</span>
          <span>Manual confirmation</span>
          <span>No payment online</span>
        </div>
      </div>
    </section>
  );
}

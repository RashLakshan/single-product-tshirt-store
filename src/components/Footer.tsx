import { siteConfig } from "@/config/site";
import { ArrowUpRight, EclipseMark, WhatsAppIcon } from "@/components/icons";
import { getGeneralWhatsAppUrl } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <a className="brand-logo brand-logo--light" href="/">
            <EclipseMark className="brand-logo__mark" />
            <span className="brand-logo__word">{siteConfig.brand.wordmark}</span>
            <span className="brand-logo__sub">{siteConfig.brand.logoSubmark}</span>
          </a>
          <p>{siteConfig.brand.description}</p>
        </div>

        <div className="site-footer__contact-card">
          <p className="eyebrow eyebrow--light">Talk to the studio</p>
          <a
            className="site-footer__whatsapp"
            href={getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
            <span>
              {siteConfig.whatsapp.display}
              <small>WhatsApp — order and fit questions</small>
            </span>
            <ArrowUpRight />
          </a>
          {siteConfig.contact.email ? (
            <a className="site-footer__email" href={`mailto:${siteConfig.contact.email}`}>
              {siteConfig.contact.email}
            </a>
          ) : null}
          <p className="site-footer__hours">{siteConfig.contact.hours}</p>
        </div>
      </div>

      <div className="site-footer__wordmark" aria-hidden="true">
        {siteConfig.brand.wordmark}
      </div>

      <div className="site-footer__cols">
        <div>
          <p className="footer-heading">Explore</p>
          <a href="/#product">The tee</a>
          <a href="/#story">About the studio</a>
          <a href="/#size-guide">Size guide</a>
          <a href="/#faq">FAQ</a>
        </div>
        <div>
          <p className="footer-heading">Help</p>
          <a href={getGeneralWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
            Contact
          </a>
          <a href="/policies/shipping/">Shipping policy</a>
          <a href="/policies/returns/">Returns & exchanges</a>
          <a href="/#reviews">Reviews</a>
        </div>
        <div>
          <p className="footer-heading">Legal</p>
          <a href="/policies/privacy/">Privacy policy</a>
          <a href="/policies/terms/">Terms & conditions</a>
        </div>
        <div>
          <p className="footer-heading">Follow</p>
          {siteConfig.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.label} <ArrowUpRight className="footer-link-arrow" />
            </a>
          ))}
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>
          © {new Date().getFullYear()} {siteConfig.brand.copyright}. All rights reserved.
        </p>
        <p>{siteConfig.product.edition} — MMXXVI</p>
        <a href="#top">
          Back to top <ArrowUpRight />
        </a>
      </div>
    </footer>
  );
}

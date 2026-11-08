"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { siteConfig } from "@/config/site";
import { OrderButton } from "@/components/OrderButton";
import { useDialog } from "@/components/useDialog";
import { CloseIcon, EclipseMark, WhatsAppIcon } from "@/components/icons";
import { getGeneralWhatsAppUrl } from "@/lib/site";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useDialog(menuOpen, () => setMenuOpen(false));

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="site-header__inner">
          <a className="brand-logo" href="/" aria-label={`${siteConfig.brand.name} — home`}>
            <EclipseMark className="brand-logo__mark" />
            <span className="brand-logo__word">{siteConfig.brand.wordmark}</span>
            <span className="brand-logo__sub">{siteConfig.brand.logoSubmark}</span>
          </a>

          <nav className="desktop-nav" aria-label="Main navigation">
            {siteConfig.nav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="site-header__actions">
            <a
              className="header-whatsapp"
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact the studio on WhatsApp"
            >
              <WhatsAppIcon />
              <span>WhatsApp</span>
            </a>
            <OrderButton label="Order the tee" variant="primary" className="site-header__cta" />
            <button
              type="button"
              className="menu-toggle"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {mounted && menuOpen
        ? createPortal(
            <div className="mobile-menu-layer">
              <div
                className="mobile-menu"
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Site menu"
                ref={panelRef}
                tabIndex={-1}
              >
                <div className="mobile-menu__top">
                  <a
                    className="brand-logo brand-logo--light"
                    href="/"
                    onClick={() => setMenuOpen(false)}
                  >
                    <EclipseMark className="brand-logo__mark" />
                    <span className="brand-logo__word">{siteConfig.brand.wordmark}</span>
                  </a>
                  <button
                    type="button"
                    className="icon-button icon-button--light"
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                    data-autofocus
                  >
                    <CloseIcon />
                  </button>
                </div>

                <nav className="mobile-menu__nav" aria-label="Mobile navigation">
                  {siteConfig.nav.map((item, index) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {item.label}
                    </a>
                  ))}
                  <a href="/#size-guide" onClick={() => setMenuOpen(false)}>
                    <span>06</span>
                    Size guide
                  </a>
                </nav>

                <div className="mobile-menu__foot">
                  <div className="mobile-menu__price">
                    <span>From</span>
                    <strong>${siteConfig.product.price} USD</strong>
                  </div>
                  <OrderButton
                    label="Order via WhatsApp"
                    variant="light"
                    icon="whatsapp"
                    fullWidth
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="mobile-menu__meta">
                    <a
                      href={getGeneralWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Message the studio
                    </a>
                    <div>
                      {siteConfig.socials.map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {social.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

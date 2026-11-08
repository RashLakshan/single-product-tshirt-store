import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { OrderProvider } from "@/components/OrderProvider";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/sections/Hero";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductPanel } from "@/components/ProductPanel";
import { WhySection } from "@/components/sections/WhySection";
import { SizeGuideSection } from "@/components/sections/SizeGuideSection";
import { StorySection } from "@/components/sections/StorySection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/Footer";
import { OrderDrawer } from "@/components/OrderDrawer";
import { StickyOrderBar } from "@/components/StickyOrderBar";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getGeneralWhatsAppUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.product.name} — ${siteConfig.product.edition} | ${siteConfig.brand.name}`,
  description:
    "An original eclipse graphic and an everyday silhouette. Discover The Eclipse Tee by AUREL and order via WhatsApp in the USA and Europe.",
  alternates: { canonical: "/" },
};

function productStructuredData() {
  const product = siteConfig.product;
  if (!product.structuredData.enabled) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => `${siteConfig.siteUrl}/images/${image.src}-1200.webp`),
    brand: {
      "@type": "Brand",
      name: siteConfig.brand.name,
    },
    sku: product.structuredData.sku,
    offers: {
      "@type": "Offer",
      priceCurrency: siteConfig.currency.code,
      price: product.price,
      availability: "https://schema.org/InStock",
      url: siteConfig.siteUrl,
      itemCondition: product.structuredData.condition,
    },
  };
}

export default function HomePage() {
  const structuredData = productStructuredData();

  return (
    <OrderProvider>
      <noscript>
        <div className="noscript-banner">
          JavaScript is disabled. The order form needs JavaScript, but you can still{" "}
          <a href={getGeneralWhatsAppUrl()}>message the studio on WhatsApp</a>.
        </div>
      </noscript>
      <AnnouncementBar />
      <SiteHeader />
      <main id="main">
        <Hero />

        <section className="product-section section" id="product" aria-labelledby="product-title">
          <div className="section-heading product-section__heading" data-reveal>
            <div>
              <p className="eyebrow">01 / The piece</p>
              <h2 id="product-title">
                A quieter kind of <em>graphic.</em>
              </h2>
            </div>
            <div className="section-heading__side">
              <p>
                The eclipse, drawn by the studio and printed at the chest. Everything else is
                edited away.
              </p>
              <span className="section-heading__note">Five views / One edition</span>
            </div>
          </div>

          <div className="product-layout">
            <ProductGallery images={siteConfig.product.images} />
            <ProductPanel />
          </div>
        </section>

        <WhySection />
        <SizeGuideSection />
        <StorySection />
        <ReviewsSection />
        <FaqSection />
        <FinalCta />
      </main>

      <Footer />
      <OrderDrawer />
      <StickyOrderBar />
      <ScrollReveal />

      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      ) : null}
    </OrderProvider>
  );
}

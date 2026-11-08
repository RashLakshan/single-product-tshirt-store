import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig, type Policy } from "@/config/site";
import { Footer } from "@/components/Footer";
import { ArrowUpRight, EclipseMark, WhatsAppIcon } from "@/components/icons";
import { getGeneralWhatsAppUrl, withBasePath } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return siteConfig.policies.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = siteConfig.policies.find((entry) => entry.slug === slug);
  if (!policy) return {};

  return {
    title: policy.title,
    description: policy.intro,
    alternates: {
      canonical: `${siteConfig.siteUrl.replace(/\/$/, "")}/policies/${policy.slug}/`,
    },
    openGraph: {
      title: `${policy.title} — ${siteConfig.brand.name}`,
      description: policy.intro,
      url: `${siteConfig.siteUrl.replace(/\/$/, "")}/policies/${policy.slug}/`,
    },
  };
}

function PolicyContent({ policy }: { policy: Policy }) {
  return (
    <div className="policy-page">
      <header className="policy-header">
        <a className="brand-logo" href={withBasePath("/")} aria-label={`${siteConfig.brand.name} — home`}>
          <EclipseMark className="brand-logo__mark" />
          <span className="brand-logo__word">{siteConfig.brand.wordmark}</span>
          <span className="brand-logo__sub">{siteConfig.brand.logoSubmark}</span>
        </a>
        <a className="policy-header__back" href={withBasePath("/")}>
          Back to the studio <ArrowUpRight />
        </a>
      </header>

      <main id="main" className="policy-main">
        <div className="policy-heading">
          <p className="eyebrow">{policy.eyebrow}</p>
          <h1>{policy.title}</h1>
          <p className="policy-heading__intro">{policy.intro}</p>
          <p className="policy-heading__updated">Last updated: {siteConfig.policiesUpdated}</p>
        </div>

        <div className="policy-body">
          <nav className="policy-index" aria-label="On this page">
            <p className="eyebrow">On this page</p>
            {policy.sections.map((section, index) => (
              <a key={section.heading} href={`#section-${index + 1}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {section.heading}
              </a>
            ))}
          </nav>

          <div className="policy-sections">
            {policy.sections.map((section, index) => (
              <section key={section.heading} id={`section-${index + 1}`}>
                <span className="policy-section__number">{String(index + 1).padStart(2, "0")}</span>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets?.length ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <div className="policy-contact">
              <div>
                <p className="eyebrow eyebrow--light">A real conversation</p>
                <h2>Questions about this policy?</h2>
                <p>
                  Message the studio directly. We will answer before you place an order enquiry.
                </p>
              </div>
              <a
                className="button button--light"
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Ask on WhatsApp</span>
                <WhatsAppIcon className="button__icon" />
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = siteConfig.policies.find((entry) => entry.slug === slug);

  if (!policy) notFound();

  return <PolicyContent policy={policy} />;
}

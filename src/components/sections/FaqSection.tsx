import { siteConfig } from "@/config/site";
import { OrderButton } from "@/components/OrderButton";
import { PlusIcon, WhatsAppIcon } from "@/components/icons";
import { getGeneralWhatsAppUrl } from "@/lib/site";

export function FaqSection() {
  return (
    <section className="faq section" id="faq" aria-labelledby="faq-title">
      <div className="faq__header" data-reveal>
        <p className="eyebrow">Questions / Answers</p>
        <h2 id="faq-title">
          Before you <em>ask.</em>
        </h2>
        <p>
          The practical details, without the small print theatre. If something is still unclear,
          the studio is one message away.
        </p>
        <div className="faq__contact">
          <span className="eyebrow eyebrow--light">Direct line</span>
          <p>Speak to a person before you order.</p>
          <a
            href={getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="button button--light button--full"
          >
            <span>Message the studio</span>
            <WhatsAppIcon className="button__icon" />
          </a>
          <small>{siteConfig.contact.hours}</small>
        </div>
      </div>

      <div className="faq__list" data-reveal>
        {siteConfig.faqs.map((faq, index) => (
          <details className="faq-item" key={faq.question}>
            <summary>
              <span className="faq-item__number">{String(index + 1).padStart(2, "0")}</span>
              <span>{faq.question}</span>
              <PlusIcon className="faq-item__plus" />
            </summary>
            <div className="faq-item__answer">
              <p>{faq.answer}</p>
            </div>
          </details>
        ))}
        <div className="faq__footer">
          <p>Still deciding?</p>
          <p>
            Order enquiries are reviewed manually. No payment is requested until availability,
            shipping and the final total are confirmed in writing.
          </p>
          <OrderButton label="Start an order enquiry" variant="text" className="faq__cta" />
        </div>
      </div>
    </section>
  );
}

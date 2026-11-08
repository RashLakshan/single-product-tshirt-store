import { siteConfig } from "@/config/site";

export function WhySection() {
  return (
    <section className="why" id="details" aria-labelledby="why-title">
      <div className="why__intro" data-reveal>
        <p className="eyebrow eyebrow--light">Why this tee</p>
        <h2 id="why-title">
          The details are <em>the design.</em>
        </h2>
        <p>
          No noise, no filler. Just a clear idea, a considered process and a direct line to the
          people who make it.
        </p>
      </div>

      <div className="why__grid" data-reveal>
        {siteConfig.benefits.map((benefit) => (
          <article className="why-card" key={benefit.number}>
            <span className="why-card__number">{benefit.number}</span>
            <h3>{benefit.title}</h3>
            <p>{benefit.text}</p>
          </article>
        ))}
      </div>

      <div className="why__marquee" aria-hidden="true">
        <div className="why__marquee-track">
          <span>Quiet graphic</span>
          <span aria-hidden="true">✳</span>
          <span>Everyday form</span>
          <span aria-hidden="true">✳</span>
          <span>Human ordering</span>
          <span aria-hidden="true">✳</span>
          <span>Quiet graphic</span>
          <span aria-hidden="true">✳</span>
          <span>Everyday form</span>
          <span aria-hidden="true">✳</span>
          <span>Human ordering</span>
          <span aria-hidden="true">✳</span>
        </div>
      </div>
    </section>
  );
}

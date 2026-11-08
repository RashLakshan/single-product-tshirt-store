import { siteConfig } from "@/config/site";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { EclipseMark } from "@/components/icons";

export function StorySection() {
  return (
    <section className="story section" id="story" aria-labelledby="story-title">
      <div className="story__visual" data-reveal>
        <ResponsiveImage
          name="lifestyle"
          alt={siteConfig.product.images[3]?.alt ?? "Editorial lifestyle photograph"}
          sizes="(max-width: 900px) 100vw, 44vw"
          imgClassName="story__image"
        />
        <div className="story__visual-meta">
          <span>Study 01</span>
          <span>Worn by you</span>
        </div>
        <span className="story__stamp" aria-hidden="true">
          <EclipseMark />
        </span>
      </div>

      <div className="story__copy" data-reveal>
        <p className="eyebrow">{siteConfig.story.eyebrow} / Philosophy</p>
        <h2 id="story-title">
          Less noise.
          <br />
          <em>More meaning.</em>
        </h2>
        <div className="story__body">
          {siteConfig.story.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <dl className="story__values">
          {siteConfig.story.values.map((value) => (
            <div key={value.label}>
              <dt>{value.label}</dt>
              <dd>{value.note}</dd>
            </div>
          ))}
        </dl>

        <blockquote className="story__quote">
          <p>“{siteConfig.story.quote}”</p>
          <cite>— AUREL Studio</cite>
        </blockquote>
      </div>
    </section>
  );
}

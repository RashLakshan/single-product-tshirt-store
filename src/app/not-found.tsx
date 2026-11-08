import { siteConfig } from "@/config/site";
import { EclipseMark } from "@/components/icons";
import { withBasePath } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="not-found" id="main">
      <a className="brand-logo" href={withBasePath("/")}>
        <EclipseMark className="brand-logo__mark" />
        <span className="brand-logo__word">{siteConfig.brand.wordmark}</span>
      </a>
      <p className="eyebrow">404 / Off the map</p>
      <h1>
        This page is not part of <em>the edition.</em>
      </h1>
      <p>The tee is still here. So is the studio.</p>
      <a className="button button--primary" href={withBasePath("/")}>
        <span>Return to the studio</span>
      </a>
    </main>
  );
}

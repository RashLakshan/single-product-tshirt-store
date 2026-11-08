"use client";

import { useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { ChevronLeft, ChevronRight, StarIcon } from "@/components/icons";

export function ReviewsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const { reviews } = siteConfig;

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".review-card");
    const step = card ? card.offsetWidth + 20 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
    setCurrent((value) => Math.min(reviews.items.length - 1, Math.max(0, value + direction)));
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".review-card");
    if (!card) return;
    const index = Math.round(track.scrollLeft / (card.offsetWidth + 20));
    setCurrent(Math.min(reviews.items.length - 1, Math.max(0, index)));
  }

  return (
    <section className="reviews section" id="reviews" aria-labelledby="reviews-title">
      <div className="reviews__header" data-reveal>
        <div>
          <p className="eyebrow eyebrow--light">Customer notes</p>
          <h2 id="reviews-title">
            Worn in <em>their words.</em>
          </h2>
          {reviews.aggregate ? (
            <div className="reviews__aggregate">
              <span aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon key={index} filled={index < Math.round(reviews.aggregate!.rating)} />
                ))}
              </span>
              <p>
                {reviews.aggregate.rating.toFixed(1)} / 5 · {reviews.aggregate.count} verified{" "}
                {reviews.aggregate.count === 1 ? "review" : "reviews"}
              </p>
            </div>
          ) : null}
        </div>
        <p>{reviews.intro}</p>
      </div>

      {reviews.demo ? (
        <div className="reviews__notice" data-reveal>
          <span>Demo</span>
          <p>{reviews.disclaimer}</p>
        </div>
      ) : null}

      <div className="reviews__carousel" data-reveal>
        <div
          className="reviews__track"
          ref={trackRef}
          onScroll={handleScroll}
          tabIndex={0}
          role="region"
          aria-label="Customer review cards"
        >
          {reviews.items.map((review, index) => (
            <article className="review-card" key={review.slot} aria-label={`${review.slot}: demo content`}>
              <div className="review-card__top">
                <span className="review-card__slot">{review.slot}</span>
                {reviews.demo ? <span className="review-card__demo">Demo</span> : null}
              </div>
              <div
                className="review-card__stars"
                aria-label={review.rating ? `${review.rating} out of 5 stars` : "No rating published"}
              >
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <StarIcon key={starIndex} filled={starIndex < review.rating} />
                ))}
                <span>{review.rating ? `${review.rating} / 5` : "No rating published"}</span>
              </div>
              <h3>{review.title}</h3>
              <p className="review-card__quote">“{review.quote}”</p>
              <footer>
                <span>{review.location}</span>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </footer>
            </article>
          ))}
        </div>

        <div className="reviews__controls">
          <p>
            <span>{String(current + 1).padStart(2, "0")}</span> /{" "}
            {String(reviews.items.length).padStart(2, "0")}
          </p>
          <div>
            <button
              type="button"
              className="carousel-button"
              onClick={() => move(-1)}
              disabled={current === 0}
              aria-label="Previous review"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              className="carousel-button"
              onClick={() => move(1)}
              disabled={current === reviews.items.length - 1}
              aria-label="Next review"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

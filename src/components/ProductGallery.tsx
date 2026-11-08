"use client";

import { useState } from "react";
import type { ProductImage } from "@/config/site";
import type { ImageName } from "@/components/ResponsiveImage";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { ChevronLeft, ChevronRight, ExpandIcon } from "@/components/icons";
import { Lightbox } from "@/components/Lightbox";

type ProductGalleryProps = {
  images: readonly ProductImage[];
};

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const activeImage = images[activeIndex];

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + images.length) % images.length);
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % images.length);
  }

  if (!activeImage) return null;

  return (
    <div className="gallery">
      <div className="gallery__stage" id="product-gallery-stage">
        <button
          type="button"
          className="gallery__open"
          onClick={() => setLightboxOpen(true)}
          aria-label={`Open larger image: ${activeImage.alt}`}
        >
          <span className="gallery__image-wrap" key={activeImage.src}>
            <ResponsiveImage
              name={activeImage.src as ImageName}
              alt={activeImage.alt}
              sizes="(max-width: 900px) 100vw, (max-width: 1280px) 58vw, 760px"
              imgClassName="gallery__img"
            />
          </span>
          <span className="gallery__expand">
            <ExpandIcon />
            View
          </span>
        </button>

        <div className="gallery__counter" aria-hidden="true">
          {String(activeIndex + 1).padStart(2, "0")}
          <span>/</span>
          {String(images.length).padStart(2, "0")}
        </div>

        <div className="gallery__arrows">
          <button type="button" className="gallery-arrow" onClick={showPrevious} aria-label="Previous product image">
            <ChevronLeft />
          </button>
          <button type="button" className="gallery-arrow" onClick={showNext} aria-label="Next product image">
            <ChevronRight />
          </button>
        </div>

        <div className="gallery__caption" aria-live="polite">
          <span>{activeImage.label}</span>
          <span>{activeImage.caption}</span>
        </div>
      </div>

      <div className="gallery__thumbs" role="group" aria-label="Choose a product image">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            aria-pressed={index === activeIndex}
            aria-label={`Show ${image.label.toLowerCase()} view`}
            className={`gallery-thumb${index === activeIndex ? " is-active" : ""}`}
            onClick={() => setActiveIndex(index)}
          >
            <span className="gallery-thumb__image">
              <ResponsiveImage
                name={image.src as ImageName}
                alt=""
                sizes="120px"
              />
            </span>
            <span className="gallery-thumb__label">{image.label}</span>
          </button>
        ))}
      </div>

      <Lightbox
        images={images}
        activeIndex={activeIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrevious={showPrevious}
        onNext={showNext}
      />
    </div>
  );
}

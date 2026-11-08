"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ProductImage } from "@/config/site";
import type { ImageName } from "@/components/ResponsiveImage";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { ChevronLeft, ChevronRight, CloseIcon } from "@/components/icons";
import { useDialog } from "@/components/useDialog";

type LightboxProps = {
  images: readonly ProductImage[];
  activeIndex: number;
  open: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export function Lightbox({
  images,
  activeIndex,
  open,
  onClose,
  onPrevious,
  onNext,
}: LightboxProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useDialog(open, onClose);
  const image = images[activeIndex];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrevious();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrevious, open]);

  if (!mounted || !open || !image) return null;

  return createPortal(
    <div className="dialog-layer dialog-layer--lightbox">
      <button
        type="button"
        className="dialog-backdrop dialog-backdrop--dark"
        aria-label="Close image viewer"
        tabIndex={-1}
        onClick={onClose}
      />
      <div
        className="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Product image viewer"
        ref={panelRef}
        tabIndex={-1}
      >
        <div className="lightbox__top">
          <p className="eyebrow">
            {image.label} — {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
          </p>
          <button
            type="button"
            className="icon-button icon-button--light"
            aria-label="Close image viewer"
            onClick={onClose}
            data-autofocus
          >
            <CloseIcon />
          </button>
        </div>
        <div className="lightbox__image">
          <ResponsiveImage
            name={image.src as ImageName}
            alt={image.alt}
            sizes="(max-width: 900px) 100vw, 88vw"
            imgClassName="lightbox__img"
          />
        </div>
        <div className="lightbox__bottom">
          <p>{image.caption}</p>
          <div className="lightbox__nav">
            <button type="button" className="icon-button icon-button--light" onClick={onPrevious} aria-label="Previous image">
              <ChevronLeft />
            </button>
            <button type="button" className="icon-button icon-button--light" onClick={onNext} aria-label="Next image">
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

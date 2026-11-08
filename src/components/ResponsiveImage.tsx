import { cn, withBasePath } from "@/lib/site";

export const imageSets = {
  hero: {
    widths: [640, 960, 1280, 1600, 2000],
    width: 2000,
    height: 2500,
  },
  front: {
    widths: [640, 900, 1200, 1600, 2000],
    width: 2400,
    height: 3600,
  },
  back: {
    widths: [640, 900, 1200],
    width: 1600,
    height: 2400,
  },
  detail: {
    widths: [600, 900, 1200, 1400],
    width: 1400,
    height: 1500,
  },
  lifestyle: {
    widths: [800, 1200, 1600],
    width: 1600,
    height: 1067,
  },
  fabric: {
    widths: [600, 900, 1200],
    width: 1600,
    height: 900,
  },
} as const;

export type ImageName = keyof typeof imageSets;

type ResponsiveImageProps = {
  name: ImageName;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

function buildSrcSet(name: ImageName, extension: "avif" | "webp") {
  return imageSets[name].widths
    .map((width) => `${withBasePath(`/images/${name}-${width}.${extension}`)} ${width}w`)
    .join(", ");
}

export function ResponsiveImage({
  name,
  alt,
  sizes,
  className,
  imgClassName,
  priority = false,
  width,
  height,
}: ResponsiveImageProps) {
  const set = imageSets[name];
  const largest = set.widths[set.widths.length - 1];

  return (
    <picture className={cn("responsive-image", className)}>
      <source type="image/avif" srcSet={buildSrcSet(name, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={buildSrcSet(name, "webp")} sizes={sizes} />
      <img
        className={imgClassName}
        src={withBasePath(`/images/${name}-${largest}.webp`)}
        alt={alt}
        width={width ?? set.width}
        height={height ?? set.height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        draggable={false}
      />
    </picture>
  );
}

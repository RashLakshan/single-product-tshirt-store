import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "art-source", "final");
const outDir = path.join(root, "public", "images");

const images = [
  { name: "hero", widths: [640, 960, 1280, 1600, 2000] },
  { name: "front", widths: [640, 900, 1200, 1600, 2000] },
  { name: "back", widths: [640, 900, 1200], quality: { avif: 55, webp: 68 } },
  { name: "detail", widths: [600, 900, 1200, 1400] },
  { name: "lifestyle", widths: [800, 1200, 1600] },
  { name: "fabric", widths: [600, 900, 1200], quality: { avif: 58, webp: 72 } },
];

await mkdir(outDir, { recursive: true });

for (const image of images) {
  const source = path.join(sourceDir, `${image.name}.jpg`);
  const metadata = await sharp(source).metadata();
  const maxWidth = Math.min(metadata.width ?? 2000, Math.max(...image.widths));

  for (const width of image.widths.filter((value) => value <= maxWidth)) {
    const base = sharp(source)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .withMetadata({ orientation: undefined });

    const avif = path.join(outDir, `${image.name}-${width}.avif`);
    const webp = path.join(outDir, `${image.name}-${width}.webp`);

    await base
      .clone()
      .avif({ quality: image.quality?.avif ?? 72, effort: 6 })
      .toFile(avif);
    await base
      .clone()
      .webp({ quality: image.quality?.webp ?? 82, effort: 5 })
      .toFile(webp);

    const [avifStats, webpStats] = await Promise.all([stat(avif), stat(webp)]);
    console.log(
      `${image.name}-${width}: avif ${(avifStats.size / 1024).toFixed(0)}kb, webp ${(webpStats.size / 1024).toFixed(0)}kb`,
    );
  }
}

await sharp(path.join(sourceDir, "og.jpg"))
  .resize(1200, 630)
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(path.join(root, "public", "og-image.jpg"));

console.log("Image optimization complete.");

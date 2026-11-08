"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

type Unit = "cm" | "inches";

export function SizeGuideSection() {
  const [unit, setUnit] = useState<Unit>("cm");
  const { sizeGuide } = siteConfig;

  return (
    <section className="size-guide section" id="size-guide" aria-labelledby="size-title">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">Fit / Measurement</p>
          <h2 id="size-title">
            Find your <em>form.</em>
          </h2>
        </div>
        <p className="section-heading__side">{sizeGuide.intro}</p>
      </div>

      <div className="size-guide__layout">
        <div className="size-guide__aside" data-reveal>
          <div className="size-guide__fit-note">
            <span className="eyebrow">A note on fit</span>
            <p>{sizeGuide.fitNote}</p>
          </div>
          <div className="size-guide__how">
            <p className="eyebrow">How to measure</p>
            <ol>
              {sizeGuide.howTo.map((step, index) => (
                <li key={step.title}>
                  <span className="size-guide__step-number">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="size-guide__table-wrap" data-reveal>
          <div className="size-guide__toolbar">
            <div className="unit-toggle" role="group" aria-label="Measurement units">
              <button
                type="button"
                className={unit === "cm" ? "is-active" : ""}
                aria-pressed={unit === "cm"}
                onClick={() => setUnit("cm")}
              >
                Centimetres
              </button>
              <button
                type="button"
                className={unit === "inches" ? "is-active" : ""}
                aria-pressed={unit === "inches"}
                onClick={() => setUnit("inches")}
              >
                Inches
              </button>
            </div>
            <span className="size-guide__unit">Garment measurements / {unit}</span>
          </div>

          <div className="table-scroll" tabIndex={0} role="region" aria-label="Size chart">
            <table className="size-table">
              <thead>
                <tr>
                  <th scope="col">Size</th>
                  {sizeGuide.columns.map((column) => (
                    <th scope="col" key={column}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizeGuide.rows.map((row) => (
                  <tr key={row.size}>
                    <th scope="row">{row.size}</th>
                    {(unit === "cm" ? row.cm : row.inches).map((value, index) => (
                      <td key={`${row.size}-${sizeGuide.columns[index]}`}>
                        {value}
                        <small>{unit === "cm" ? "cm" : "in"}</small>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sizeGuide.isPlaceholder ? (
            <p className="size-guide__disclaimer">
              <span>Note</span>
              {sizeGuide.note}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

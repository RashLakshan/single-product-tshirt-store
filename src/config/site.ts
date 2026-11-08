/**
 * AUREL — single source of truth.
 *
 * Everything the store owner is likely to change lives in this file:
 * brand details, WhatsApp number, product price/options, images, copy,
 * shipping/returns wording, FAQs, reviews and policy pages.
 *
 * Search for "OWNER:" to find the details that must be confirmed before launch.
 */

export type ProductSize = {
  label: string;
  available: boolean;
};

export type ProductColor = {
  name: string;
  hex: string;
  note?: string;
};

export type ProductImage = {
  /** File stem inside /public/images, e.g. "front" → front-640.avif */
  src: string;
  alt: string;
  label: string;
  caption: string;
  placeholder?: boolean;
};

export type PolicySection = {
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export type Policy = {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  sections: readonly PolicySection[];
};

export const siteConfig = {
  /** OWNER: replace with the production domain before deployment. */
  siteUrl: "https://aurel-eclipse.example",

  brand: {
    name: "AUREL",
    wordmark: "AUREL",
    logoSubmark: "Studio",
    fullName: "AUREL Studio",
    tagline: "A study in quiet form.",
    description:
      "A design-led studio exploring graphic essentials — pieces reduced to a single idea, made to be worn often and kept for years.",
    copyright: "AUREL",
  },

  /**
   * OWNER: enter the WhatsApp Business number in international format.
   * Digits only. No +, spaces, brackets or dashes.
   * Example: United States +1 202 555 0147 → "12025550147".
   * The number below is a reserved fictional number for the demo.
   */
  whatsapp: {
    number: "12025550147",
    display: "+1 (202) 555-0147",
    /** OWNER: this number is a demo placeholder until replaced. */
    isPlaceholder: true,
    supportMessage:
      "Hello AUREL, I have a question about The Eclipse Tee. Could you help me?",
    responseNote: "Messages are answered by the studio during business hours.",
  },

  currency: {
    code: "USD",
    locale: "en-US",
  },

  /**
   * Shipping is manual by default. If the studio uses a flat published rate,
   * set mode to "flat" and enter a verified amount. Shipping is still shown
   * separately from the product price.
   */
  shipping: {
    mode: "manual" as "manual" | "flat",
    flatRate: null as number | null,
    manualLabel: "Confirmed via WhatsApp",
    estimateLabel: "Estimated shipping",
  },

  announcement: {
    message: "EDITION 01 — WORLDWIDE ORDER ENQUIRIES VIA WHATSAPP",
    aside: "USA / EUROPE",
  },

  nav: [
    { label: "Shop", href: "/#product" },
    { label: "About", href: "/#story" },
    { label: "Details", href: "/#details" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
  ],

  product: {
    name: "The Eclipse Tee",
    shortName: "Eclipse Tee",
    edition: "Edition 01",
    /** OWNER: sample price. Update when the final retail price is set. */
    price: 58,
    description:
      "One graphic, drawn for this edition. A quiet eclipse sits at the chest, cut into an everyday silhouette with nothing that asks for attention.",
    shortDescription:
      "A quiet graphic. An everyday silhouette. The tee you reach for without thinking.",
    heroLine:
      "One original graphic. One considered silhouette. An everyday tee with nothing to prove.",
    colors: [
      { name: "Bone", hex: "#E8E1D5", note: "Warm off-white" },
      { name: "Washed Black", hex: "#2A2825", note: "Soft black" },
      { name: "Clay", hex: "#A66A50", note: "Earthy clay" },
    ] satisfies ProductColor[],
    sizes: [
      { label: "S", available: true },
      { label: "M", available: true },
      { label: "L", available: true },
      { label: "XL", available: true },
      { label: "XXL", available: true },
    ] satisfies ProductSize[],
    images: [
      {
        src: "front",
        alt: "Model wearing the bone-white Eclipse Tee, front view, with the original eclipse chest print.",
        label: "Front",
        caption: "Front view — shown in Bone",
        placeholder: true,
      },
      {
        src: "back",
        alt: "Back view of the bone Eclipse Tee hanging against a raw concrete wall, showing the AUREL back print.",
        label: "Back",
        caption: "Back view — shown in Bone",
        placeholder: true,
      },
      {
        src: "detail",
        alt: "Close-up of the black eclipse graphic and AUREL edition text printed on the bone-coloured tee.",
        label: "Print",
        caption: "Print detail — screen-print study",
        placeholder: true,
      },
      {
        src: "lifestyle",
        alt: "Editorial lifestyle image of a model wearing a relaxed white tee beside dark water.",
        label: "Lifestyle",
        caption: "Lifestyle — editorial placeholder",
        placeholder: true,
      },
      {
        src: "fabric",
        alt: "Macro photograph showing a natural, warm off-white woven fabric texture.",
        label: "Fabric",
        caption: "Fabric — texture reference",
        placeholder: true,
      },
    ] satisfies ProductImage[],

    /** OWNER: these are intentionally unfilled. Add verified facts only. */
    material: {
      value: null as string | null,
      placeholder:
        "Fabric composition, weight and origin are pending studio confirmation. Ask us on WhatsApp for the latest verified details.",
      status: "To be confirmed",
    },
    fit: {
      value: null as string | null,
      placeholder:
        "The final fit notes are pending studio confirmation. Our team can help you choose a size before ordering.",
      status: "To be confirmed",
    },
    care: {
      value: null as string | null,
      placeholder:
        "Care instructions will be published once the final garment specification is confirmed.",
      status: "To be confirmed",
    },

    shippingSummary:
      "Shipping is quoted separately for your destination and confirmed in writing before payment.",
    returnsSummary:
      "Return and exchange eligibility is confirmed before you pay. Read the full policy for details.",

    structuredData: {
      /**
       * Keep false until price, availability, material, SKU and images are
       * genuinely accurate. Google product structured data must not be fake.
       */
      enabled: false,
      sku: "",
      condition: "https://schema.org/NewCondition",
    },
  },

  sizeGuide: {
    title: "Find your form.",
    intro:
      "A considered fit should feel easy, not exacting. Use the guide below, then ask the studio if you are between sizes.",
    /** OWNER: sample measurements only. Replace with measured garment specs. */
    isPlaceholder: true,
    note:
      "Sample measurements — for layout preview only. Confirm every value against the final garment before publishing.",
    fitNote:
      "If you prefer a closer fit, our team can advise on sizing before you order. Send us your usual size on WhatsApp.",
    columns: ["Chest", "Length", "Shoulder", "Sleeve"],
    rows: [
      { size: "S", cm: [54, 70, 48, 21], inches: [21.3, 27.6, 18.9, 8.3] },
      { size: "M", cm: [57, 72, 50, 22], inches: [22.4, 28.3, 19.7, 8.7] },
      { size: "L", cm: [60, 74, 52, 23], inches: [23.6, 29.1, 20.5, 9.1] },
      { size: "XL", cm: [63, 76, 54, 24], inches: [24.8, 29.9, 21.3, 9.4] },
      { size: "XXL", cm: [66, 78, 56, 25], inches: [26.0, 30.7, 22.0, 9.8] },
    ],
    howTo: [
      {
        title: "Chest",
        text: "Lay your best-fitting tee flat and measure straight across from underarm to underarm. Double it for the full circumference.",
      },
      {
        title: "Length",
        text: "Measure from the highest point of the shoulder to the bottom hem.",
      },
      {
        title: "Shoulder & sleeve",
        text: "Measure shoulder seam to shoulder seam, then from the shoulder seam to the sleeve edge.",
      },
    ],
  },

  benefits: [
    {
      number: "01",
      title: "An original study",
      text: "The eclipse mark was drawn for this edition — a graphic that belongs to no one else.",
    },
    {
      number: "02",
      title: "One clear idea",
      text: "One tee. Three colourways. No endless collection designed to make you second-guess.",
    },
    {
      number: "03",
      title: "A human on the other side",
      text: "Every enquiry reaches the studio. Availability, shipping and payment are confirmed by a person, not an automated checkout.",
    },
    {
      number: "04",
      title: "Open across borders",
      text: "Order enquiries are welcome from the United States and Europe. Final delivery details are confirmed for your destination.",
    },
  ],

  story: {
    eyebrow: "The studio",
    title: "Less noise. More meaning.",
    paragraphs: [
      "AUREL began with a simple question: what if the most useful thing in a wardrobe was also the most considered?",
      "We design graphic essentials around one idea at a time. A single mark. A deliberate silhouette. A palette that works with what you already own.",
      "This is not about seasons or shelves of options. It is about one piece you can wear until it becomes yours.",
    ],
    values: [
      { label: "Restraint", note: "One graphic, edited until only the essential remains." },
      { label: "Materiality", note: "Details confirmed with the maker, never assumed." },
      { label: "Individuality", note: "Designed to sit back and let the wearer speak." },
    ],
    quote: "Clothes should not compete with the person wearing them.",
  },

  reviews: {
    demo: true,
    aggregate: null as { rating: number; count: number } | null,
    title: "Worn in their words.",
    intro:
      "We publish reviews only from confirmed customers. Until those arrive, this area is clearly labelled as a layout preview.",
    disclaimer:
      "DEMO CONTENT — these are sample review cards, not real customer testimonials or ratings. Replace them in src/config/site.ts before launch.",
    items: [
      {
        slot: "Review slot 01",
        title: "A verified review will live here",
        quote:
          "This is a layout preview. Replace this text with a genuine review from a customer who has received their tee.",
        rating: 0,
        location: "Awaiting verified feedback",
      },
      {
        slot: "Review slot 02",
        title: "No invented ratings",
        quote:
          "Stars are intentionally left unfilled. Add a rating only when a real customer has given one and has agreed to publication.",
        rating: 0,
        location: "Demo content",
      },
      {
        slot: "Review slot 03",
        title: "Real words only",
        quote:
          "Once you have confirmed reviews, add them to the configuration file with the customer's permission and the order reference.",
        rating: 0,
        location: "Layout preview",
      },
    ],
  },

  faqs: [
    {
      question: "What sizes are available?",
      answer:
        "The edition is offered from S to XXL. Size availability is confirmed by the studio after you send your enquiry. If a size is unavailable, we will tell you before any payment is requested.",
    },
    {
      question: "What material is the T-shirt made from?",
      answer:
        "OWNER TO CONFIRM: add the verified fabric composition, weight and origin here in the configuration file. We do not publish material claims until they are confirmed by the garment maker.",
    },
    {
      question: "How do I select my size?",
      answer:
        "Use the size guide on this page to compare the sample measurements with a tee you already own. If you are between sizes, message the studio on WhatsApp and we will help before you order.",
    },
    {
      question: "Do you ship to the USA and Europe?",
      answer:
        "Order enquiries are welcome from the United States and Europe. Delivery availability and cost are confirmed individually for your address before payment. No shipping charge is collected on this website.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "A delivery estimate is confirmed in writing for your destination after your order enquiry is reviewed. We do not promise a fixed delivery window on this page.",
    },
    {
      question: "What payment methods are available?",
      answer:
        "No payment is taken on this website. After availability, shipping and the final total are confirmed, the studio will share the accepted payment methods and instructions by WhatsApp.",
    },
    {
      question: "Can I return or exchange my order?",
      answer:
        "Return and exchange eligibility is confirmed before you pay and is set out in the returns policy. If you have a question about fit before ordering, ask us first — we would rather help you get it right.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "The fastest route is WhatsApp, using the order or support button on this page. You will be speaking with the studio directly.",
    },
  ],

  countries: [
    "United States",
    "United Kingdom",
    "Canada",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "Belgium",
    "Austria",
    "Switzerland",
    "Ireland",
    "Portugal",
    "Sweden",
    "Denmark",
    "Norway",
    "Finland",
    "Poland",
    "Czechia",
    "Greece",
    "Luxembourg",
    "Croatia",
    "Slovenia",
    "Slovakia",
    "Romania",
    "Bulgaria",
    "Hungary",
    "Estonia",
    "Latvia",
    "Lithuania",
    "Australia",
    "New Zealand",
    "United Arab Emirates",
    "Other",
  ],

  trustPoints: [
    "Worldwide order enquiries",
    "Manual confirmation",
    "No payment online",
  ],

  socials: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Pinterest", href: "https://www.pinterest.com/" },
  ],

  contact: {
    /** Add a real support email if you want one shown. null hides it. */
    email: null as string | null,
    hours: "Studio replies are sent during business hours.",
  },

  policiesUpdated: "November 2026",

  policies: [
    {
      slug: "shipping",
      title: "Shipping Policy",
      eyebrow: "Help / Shipping",
      intro:
        "This page explains how shipping is handled for this edition. Shipping is arranged manually after your order enquiry is confirmed.",
      sections: [
        {
          heading: "Order enquiries and confirmation",
          paragraphs: [
            "Submitting an order form opens WhatsApp with your details. It does not confirm an order, reserve stock or create a payment obligation.",
            "The studio will review availability for your selected size and colour, then confirm shipping cost and the final total in writing.",
          ],
        },
        {
          heading: "Shipping cost",
          paragraphs: [
            "Shipping is calculated separately for each destination. The product price shown on this website excludes shipping.",
            "No shipping charge is collected on this website. The confirmed amount will be shared by WhatsApp before any payment is requested.",
          ],
        },
        {
          heading: "Delivery estimates",
          paragraphs: [
            "Delivery timing depends on destination, stock confirmation and the carrier. An estimate is confirmed individually; no fixed delivery window is promised on this page.",
          ],
        },
        {
          heading: "Destinations",
          paragraphs: [
            "Order enquiries are accepted from the United States and Europe. If your country is not listed in the order form, select “Other” and include your location in the notes. The studio will confirm whether delivery is possible.",
          ],
        },
        {
          heading: "Tracking and responsibility",
          paragraphs: [
            "Where tracking is available, it will be shared after dispatch. The studio will confirm the carrier and tracking arrangements before payment.",
          ],
        },
        {
          heading: "Questions",
          paragraphs: [
            "For anything unclear, contact the studio on WhatsApp before ordering. OWNER: add any additional verified shipping terms here before launch.",
          ],
        },
      ],
    },
    {
      slug: "returns",
      title: "Returns & Exchanges",
      eyebrow: "Help / Returns",
      intro:
        "Return and exchange terms are confirmed before you pay. This page is a transparent template until the owner adds verified policy details.",
      sections: [
        {
          heading: "Before you order",
          paragraphs: [
            "If you are unsure about fit or colour, ask the studio before paying. Measurements, available stock and any return conditions can be confirmed in writing first.",
          ],
        },
        {
          heading: "Return window",
          paragraphs: [
            "OWNER: add your verified return window and conditions here. No return window is promised on this page until it has been confirmed.",
          ],
        },
        {
          heading: "Condition of items",
          paragraphs: [
            "Any return or exchange will be subject to the condition requirements confirmed by the studio before purchase. This may include unworn condition, original packaging and proof of purchase.",
          ],
        },
        {
          heading: "How to start a return",
          paragraphs: [
            "Contact the studio on WhatsApp with your order reference and reason for the request. The team will explain the next steps and whether the item is eligible.",
          ],
        },
        {
          heading: "Costs and refunds",
          paragraphs: [
            "Return shipping responsibility, refund timing and any exchange handling are confirmed in writing before purchase. No refund timeline is promised on this page.",
          ],
        },
      ],
    },
    {
      slug: "privacy",
      title: "Privacy Policy",
      eyebrow: "Legal / Privacy",
      intro:
        "This website is designed to collect as little data as possible. It does not process payments and does not run advertising or analytics trackers.",
      sections: [
        {
          heading: "What this website does",
          paragraphs: [
            "The order form runs in your browser. The site does not store your form entries on a server and does not send them to a database.",
            "When you choose to continue, your order details are placed into a prefilled WhatsApp message. WhatsApp's own terms and privacy policy apply from that point.",
          ],
        },
        {
          heading: "Information you choose to send",
          paragraphs: [
            "The form asks for your name, country, city, delivery address, postal code, selected product options and quantity. Email and notes are optional. These details are used only to respond to your order enquiry.",
          ],
        },
        {
          heading: "Cookies and local storage",
          paragraphs: [
            "This website does not use advertising cookies or third-party analytics. A small browser preference may be saved locally when you dismiss the announcement bar. That preference stays in your browser.",
          ],
        },
        {
          heading: "Service providers",
          paragraphs: [
            "Hosting may be provided by a static hosting service. Communications are handled through WhatsApp. Each provider processes data under its own policy.",
          ],
        },
        {
          heading: "Your choices",
          paragraphs: [
            "You can choose not to submit the form. If you have already contacted the studio, you can ask for your enquiry details to be corrected or deleted by replying on WhatsApp.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            "For a privacy question, contact the studio on WhatsApp using the contact link in the footer. OWNER: add a business address or privacy email here if required in your jurisdiction.",
          ],
        },
      ],
    },
    {
      slug: "terms",
      title: "Terms & Conditions",
      eyebrow: "Legal / Terms",
      intro:
        "These terms describe how this single-product website works. They do not replace the written confirmation of availability, shipping and payment shared by the studio.",
      sections: [
        {
          heading: "About this website",
          paragraphs: [
            "This website presents one T-shirt edition and allows visitors to generate an order enquiry through WhatsApp. It is not an automated checkout.",
          ],
        },
        {
          heading: "Orders and acceptance",
          paragraphs: [
            "Submitting the order form is an enquiry, not a confirmed order. An order is confirmed only after the studio has replied and the parties have agreed availability, shipping, the final total and payment instructions.",
          ],
        },
        {
          heading: "Pricing",
          paragraphs: [
            "Prices are displayed in US dollars. The product price excludes shipping, duties or local taxes unless the studio states otherwise in writing. The final amount is confirmed before payment.",
          ],
        },
        {
          heading: "Product information",
          paragraphs: [
            "Product specifications marked as pending are not yet published as verified facts. The studio will confirm final details before purchase. Screen colours can differ from the physical garment.",
          ],
        },
        {
          heading: "Intellectual property",
          paragraphs: [
            "The AUREL name, eclipse artwork, copy, layout and imagery on this website are protected by applicable intellectual property laws. They may not be reproduced for commercial use without permission.",
          ],
        },
        {
          heading: "Liability and governing law",
          paragraphs: [
            "OWNER: add the verified legal entity, jurisdiction and any required consumer-law disclosures here before launch. Nothing on this page limits rights that cannot be limited by law.",
          ],
        },
      ],
    },
  ] satisfies Policy[],
} as const;

export type SiteConfig = typeof siteConfig;

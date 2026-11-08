"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { CloseIcon } from "@/components/icons";

const STORAGE_KEY = "aurel-announcement-dismissed";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "true") {
        setVisible(false);
      }
    } catch {
      // Storage may be unavailable; the bar simply remains visible.
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore storage failures.
    }
  }

  if (!visible) return null;

  return (
    <aside className="announcement" aria-label="Site announcement">
      <p>{siteConfig.announcement.message}</p>
      <span className="announcement__aside">{siteConfig.announcement.aside}</span>
      <button
        type="button"
        className="announcement__close"
        onClick={dismiss}
        aria-label="Dismiss announcement"
      >
        <CloseIcon />
      </button>
    </aside>
  );
}

"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { useOrder } from "@/components/OrderProvider";
import { ArrowUpRight } from "@/components/icons";
import { formatPrice } from "@/lib/site";

export function StickyOrderBar() {
  const { openOrder, isOrderOpen } = useOrder();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      setVisible(window.scrollY > Math.max(520, window.innerHeight * 0.55));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!visible || isOrderOpen) return null;

  return (
    <div className="sticky-order">
      <div className="sticky-order__info">
        <span>{siteConfig.product.shortName}</span>
        <strong>{formatPrice(siteConfig.product.price, { showCode: true })}</strong>
      </div>
      <button type="button" className="button button--primary" onClick={() => openOrder()}>
        <span>ORDER NOW</span>
        <ArrowUpRight className="button__icon" />
      </button>
    </div>
  );
}

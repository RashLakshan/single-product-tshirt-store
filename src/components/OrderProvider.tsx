"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { siteConfig } from "@/config/site";

type OpenOrderOptions = {
  size?: string;
  color?: string;
  quantity?: number;
};

type OrderContextValue = {
  isOrderOpen: boolean;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  setSelectedSize: (size: string) => void;
  setSelectedColor: (color: string) => void;
  setQuantity: (quantity: number) => void;
  openOrder: (options?: OpenOrderOptions) => void;
  closeOrder: () => void;
};

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    siteConfig.product.colors[0]?.name ?? "",
  );
  const [quantity, setQuantityState] = useState(1);

  const setQuantity = useCallback((next: number) => {
    setQuantityState(Math.min(10, Math.max(1, Math.round(next))));
  }, []);

  const openOrder = useCallback((options?: OpenOrderOptions) => {
    if (options?.size !== undefined) setSelectedSize(options.size);
    if (options?.color !== undefined) setSelectedColor(options.color);
    if (options?.quantity !== undefined) {
      setQuantityState(Math.min(10, Math.max(1, Math.round(options.quantity))));
    }
    setIsOrderOpen(true);
  }, []);

  const closeOrder = useCallback(() => setIsOrderOpen(false), []);

  const value = useMemo(
    () => ({
      isOrderOpen,
      selectedSize,
      selectedColor,
      quantity,
      setSelectedSize,
      setSelectedColor,
      setQuantity,
      openOrder,
      closeOrder,
    }),
    [
      closeOrder,
      isOrderOpen,
      openOrder,
      quantity,
      selectedColor,
      selectedSize,
      setQuantity,
    ],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used inside OrderProvider");
  }
  return context;
}

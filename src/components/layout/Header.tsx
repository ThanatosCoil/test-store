"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";

export const Header: React.FC = () => {
  const { getTotalItems, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Предотвращение несоответствия гидратации
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-10 border-b border-gray-700 bg-gray-800 shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-white">
          Тестовый магазин
        </Link>

        <div className="flex items-center space-x-4">
          {!mounted ? (
            // Заглушка для информации о корзине
            <div className="flex items-center">
              <div className="flex items-center rounded-lg bg-blue-500 px-4 py-2 text-white shadow-md">
                <div className="mr-2 h-5 w-5 animate-pulse rounded-full bg-blue-300"></div>
                <div className="h-5 w-20 animate-pulse rounded bg-blue-300"></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition-all duration-300 hover:bg-blue-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <div>
                  <div className="flex items-center text-sm font-medium">
                    <span className="mr-1">{getTotalItems()}</span>
                    <span className="mr-2">
                      {getTotalItems() === 1
                        ? "товар"
                        : getTotalItems() >= 2 && getTotalItems() <= 4
                        ? "товара"
                        : "товаров"}
                    </span>
                    {getTotalItems() > 0 && (
                      <span className="font-bold">
                        {formatCurrency(getTotalPrice())}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

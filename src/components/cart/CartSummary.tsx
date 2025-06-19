"use client";
import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";

export const CartSummary: React.FC = () => {
  const {
    items,
    getTotalItems,
    getTotalPrice,
    removeFromCart,
    updateQuantity,
  } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Этот эффект необходим, потому что персистентность localStorage в Zustand
  // может вызвать несоответствия при гидратации с серверным рендерингом Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-100 p-4 shadow-md">
        <div className="animate-pulse">
          <div className="mb-2 h-5 w-1/3 bg-blue-200"></div>
          <div className="h-6 w-2/3 bg-blue-200"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-100 p-4 shadow-md">
        <h3 className="mb-2 text-xl font-semibold text-gray-900">Корзина</h3>
        <p className="text-gray-800">
          Ваша корзина пуста. Добавьте товары для оформления заказа.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-100 p-4 shadow-md">
      <h3 className="mb-4 text-xl font-semibold text-gray-900">Корзина</h3>

      {/* Общая информация */}
      <div className="mb-4 rounded-md bg-blue-50 p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              В вашей корзине:
            </p>
            <p className="text-lg font-medium text-gray-900">
              {getTotalItems()}{" "}
              {getTotalItems() === 1
                ? "товар"
                : getTotalItems() >= 2 && getTotalItems() <= 4
                ? "товара"
                : "товаров"}{" "}
              на сумму {formatCurrency(getTotalPrice())}
            </p>
          </div>
        </div>
      </div>

      {/* Список товаров в корзине */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative rounded-md bg-gray-50 p-4 shadow-sm"
          >
            {/* Кнопка удаления - теперь абсолютно позиционирована в правом верхнем углу */}
            <button
              onClick={() => removeFromCart(item.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
              aria-label="Удалить из корзины"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Информация о товаре - более структурированная для всех экранов */}
            <div className="pr-6">
              <p className="font-medium text-gray-800 mb-2">
                {item.product?.title || "Товар"}
              </p>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                {/* Цена и общая стоимость */}
                <div className="flex items-center">
                  {item.quantity === 1 ? (
                    <span className="font-medium text-blue-600">
                      {formatCurrency(item.product?.price || 0)}
                    </span>
                  ) : (
                    <>
                      <span className="text-sm text-gray-600 mr-2">
                        {formatCurrency(item.product?.price || 0)}
                      </span>
                      <span className="text-sm text-gray-600">
                        × {item.quantity} ={" "}
                        <span className="font-medium text-blue-600">
                          {formatCurrency(
                            (item.product?.price || 0) * item.quantity
                          )}
                        </span>
                      </span>
                    </>
                  )}
                </div>

                {/* Кнопки изменения количества */}
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-8 w-8 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center"
                    aria-label="Уменьшить количество"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-8 w-8 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center"
                    aria-label="Увеличить количество"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

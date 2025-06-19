"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { QuantityInput } from "@/components/ui/QuantityInput";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { items, addToCart, updateQuantity, removeFromCart } = useCartStore();
  const cartItem = items.find((item) => item.id === product.id);
  const [isAddedToCart, setIsAddedToCart] = useState(!!cartItem);
  const [quantity, setQuantity] = useState(cartItem?.quantity || 1);
  const [imageError, setImageError] = useState(false);

  // Синхронизация состояния с корзиной
  useEffect(() => {
    const cartItem = items.find((item) => item.id === product.id);
    setIsAddedToCart(!!cartItem);
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1); // Сбрасываем на 1, если товар был удален из корзины
    }
  }, [items, product.id]);

  // Проверка и обработка URL изображения
  const imageUrl = useMemo(() => {
    // Если URL содержит заблокированный домен, заменяем на альтернативу
    if (product.image_url && product.image_url.includes("picsum.photos")) {
      // Используем альтернативный сервис изображений
      return `https://placehold.co/400x300/eee/999?text=Product+${product.id}`;
    }
    return product.image_url;
  }, [product.image_url, product.id]);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAddedToCart(true);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    if (newQuantity <= 0) {
      removeFromCart(product.id);
      setIsAddedToCart(false);
      setQuantity(1); // Сбрасываем на 1 для следующего добавления
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-md transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:translate-y-[-3px]">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-200">
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center"
            priority={false}
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
            <div className="text-center">
              <div className="text-lg font-medium">{product.title}</div>
              <div className="text-sm">Изображение недоступно</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-medium text-gray-900">
          {product.title}
        </h3>

        <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-500">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="mb-3 text-xl font-bold text-gray-900">
            {formatCurrency(product.price)}
          </div>

          {!isAddedToCart ? (
            <Button onClick={handleAddToCart} fullWidth variant="primary">
              Купить
            </Button>
          ) : (
            <div className="flex items-center justify-between">
              <QuantityInput
                value={quantity}
                onChange={handleQuantityChange}
                min={0}
                max={99}
              />
              <div className="ml-2 text-sm font-bold text-blue-600">
                {formatCurrency(product.price * quantity)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

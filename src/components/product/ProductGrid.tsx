"use client";

import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { getProducts } from "@/api";

// Компонент заглушки для товаров
const ProductSkeleton = () => (
  <div className="animate-pulse rounded-lg bg-gray-200 p-4">
    <div className="mb-4 aspect-square w-full bg-gray-300"></div>
    <div className="mb-2 h-6 w-3/4 bg-gray-300"></div>
    <div className="mb-4 h-20 w-full bg-gray-300"></div>
    <div className="mb-3 h-6 w-1/3 bg-gray-300"></div>
    <div className="h-10 w-full bg-gray-300"></div>
  </div>
);

export const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Изменено на true для предзагрузки
  const [error, setError] = useState<string | null>(null);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const loadProducts = async (pageNum: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getProducts(pageNum);

      if (pageNum === 1) {
        setProducts(data.items);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...data.items]);
      }

      setTotalPages(Math.ceil(data.total / 20));
    } catch (err) {
      setError("Не удалось загрузить товары. Пожалуйста, попробуйте позже.");
      console.error("Error loading products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load first page on mount
  useEffect(() => {
    loadProducts(1);
  }, []);

  // Load more products when reaching the end of the list
  useEffect(() => {
    if (inView && !isLoading && page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(nextPage);
    }
  }, [inView, isLoading, page, totalPages]);

  if (error && products.length === 0) {
    return (
      <div className="my-12 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => loadProducts(1)}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="py-4">
      {products.length === 0 && isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Индикатор загрузки при прокрутке */}
          {isLoading && (
            <div className="mt-8 flex justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            </div>
          )}

          {/* Элемент для отслеживания пересечения */}
          {!isLoading && page < totalPages && (
            <div ref={ref} className="h-10 w-full"></div>
          )}

          {page >= totalPages && products.length > 0 && (
            <p className="mt-8 text-center text-gray-500">
              Вы просмотрели все товары
            </p>
          )}
        </>
      )}
    </div>
  );
};

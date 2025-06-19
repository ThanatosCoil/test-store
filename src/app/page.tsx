"use client";

import React from "react";
import { Layout } from "@/components/layout/Layout";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { CartSummary } from "@/components/cart/CartSummary";
import { OrderForm } from "@/components/cart/OrderForm";

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <ReviewsSection />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="block lg:hidden mb-8">
            <div className="space-y-6">
              <CartSummary />
              <OrderForm />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div>
              <h2 className="mb-8 text-2xl font-bold inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                Наши товары
              </h2>
            </div>
            <ProductGrid />
          </div>

          {/* Десктопная версия корзины и формы заказа */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="mt-[95px] space-y-6">
              <CartSummary />
              <OrderForm />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

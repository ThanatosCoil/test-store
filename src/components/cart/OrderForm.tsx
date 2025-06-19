"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { submitOrder } from "@/api";
import { CartItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

export const OrderForm: React.FC = () => {
  const { items, phoneNumber, setPhoneNumber, clearCart, getTotalPrice } =
    useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([]);
  const [orderTotal, setOrderTotal] = useState<number>(0);

  const validatePhone = (phone: string): boolean => {
    // Удаляем все нецифровые символы
    const digitsOnly = phone.replace(/\D/g, "");
    // Российский номер телефона должен содержать 11 цифр, включая код страны
    return digitsOnly.length === 11;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    setOrderError(null);

    // Валидация номера телефона
    if (!validatePhone(phoneNumber)) {
      setPhoneError("Пожалуйста, введите корректный номер телефона");
      return;
    }

    // Проверяем, что корзина не пуста
    if (items.length === 0) {
      setOrderError("Корзина пуста. Добавьте товары для оформления заказа.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Подготавливаем данные заказа
      const orderData = {
        phone: phoneNumber.replace(/\D/g, ""),
        cart: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await submitOrder(orderData);

      if (response.success === 1) {
        // Сохраняем информацию о заказанных товарах перед очисткой корзины
        setOrderedItems([...items]);
        setOrderTotal(getTotalPrice());

        // Показываем модальное окно успеха
        setIsSuccessModalOpen(true);
        clearCart();
      } else {
        setOrderError(
          response.error || "Произошла ошибка при оформлении заказа"
        );
      }
    } catch (error) {
      setOrderError(
        "Не удалось отправить заказ. Пожалуйста, попробуйте позже."
      );
      console.error("Order submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    setPhoneNumber(value || "");
    if (phoneError) setPhoneError(null);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-md"
      >
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          Оформление заказа
        </h3>

        {orderError && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700">
            {orderError}
          </div>
        )}

        <div className="mb-6">
          <PhoneInput
            label="Номер телефона"
            value={phoneNumber}
            onChange={handlePhoneChange}
            error={phoneError || undefined}
            disabled={isSubmitting}
            required
          />
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting || items.length === 0}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Оформление...
            </span>
          ) : (
            "Заказать"
          )}
        </Button>
      </form>

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Заказ успешно оформлен!"
      >
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <svg
              className="h-16 w-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <p className="mb-4 text-lg text-gray-800">
            Ваш заказ успешно оформлен! Мы свяжемся с вами в ближайшее время для
            подтверждения деталей.
          </p>

          {/* Информация о заказанных товарах */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3 text-left">
            <h3 className="mb-2 font-medium text-gray-800">Состав заказа:</h3>
            <ul className="mb-3 space-y-2 text-sm">
              {orderedItems.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span className="text-gray-700">
                    {item.product?.title} × {item.quantity}
                  </span>
                  <span className="font-medium text-gray-800">
                    {formatCurrency((item.product?.price || 0) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 pt-2 text-right">
              <span className="font-bold text-gray-800">
                Итого: {formatCurrency(orderTotal)}
              </span>
            </div>
          </div>

          <Button onClick={() => setIsSuccessModalOpen(false)}>Закрыть</Button>
        </div>
      </Modal>
    </>
  );
};

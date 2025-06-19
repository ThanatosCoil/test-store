"use client";

import React, { forwardRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

export interface PhoneInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  value: string;
  onChange: (value: string | undefined) => void;
  error?: string;
  label?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, error, label, value, onChange, ...props }, ref) => {
    // Форматирование номера телефона при вводе
    const formatPhoneNumber = (input: string): string => {
      // Удаляем все нецифровые символы
      const digitsOnly = input.replace(/\D/g, "");

      // Ограничиваем длину до 11 цифр (для российского номера)
      const truncated = digitsOnly.slice(0, 11);

      // Форматируем номер телефона
      let formatted = "";
      if (truncated.length > 0) {
        formatted = "+7";
        if (truncated.length > 1) {
          formatted += ` (${truncated.slice(1, 4)}`;
        }
        if (truncated.length > 4) {
          formatted += `) ${truncated.slice(4, 7)}`;
        }
        if (truncated.length > 7) {
          formatted += `-${truncated.slice(7, 9)}`;
        }
        if (truncated.length > 9) {
          formatted += `-${truncated.slice(9, 11)}`;
        }
      }

      return formatted;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value);
      onChange(formatted);
    };

    // Определяем, нужен ли плейсхолдер
    const placeholder = "+7 (___) ___-__-__";

    return (
      <div className="w-full">
        {label && (
          <label
            className="mb-2 block text-sm font-medium text-gray-700"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <div className="flex items-center rounded-md border border-gray-300 bg-white focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-500">
            <div className="flex items-center pl-3">
              <span className="text-gray-500">
                <img
                  src="https://flagcdn.com/w20/ru.png"
                  alt="RU"
                  className="h-4 w-auto mr-1"
                />
              </span>
            </div>
            <input
              type="tel"
              value={value}
              onChange={handleInputChange}
              placeholder={placeholder}
              className={twMerge(
                "flex h-10 w-full rounded-md border-0 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-red-500 focus:ring-red-500",
                className
              )}
              {...props}
              ref={ref}
            />
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

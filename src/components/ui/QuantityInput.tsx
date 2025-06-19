"use client";

import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
  value,
  onChange,
  min = 1,
  max = 999,
  className,
}) => {
  const [localValue, setLocalValue] = useState<string>(value.toString());

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleIncrement = () => {
    const newValue = Math.min(max, value + 1);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = value - 1;
    onChange(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Разрешаем пустой ввод для набора текста
    if (inputValue === "") {
      setLocalValue("");
      return;
    }

    // Разрешаем только цифры
    if (!/^\d+$/.test(inputValue)) {
      return;
    }

    setLocalValue(inputValue);
  };

  const handleBlur = () => {
    let numValue = parseInt(localValue || "0", 10);

    // Применяем ограничения мин/макс
    numValue = Math.max(min, Math.min(max, numValue));

    // Обновляем состояние родителя
    onChange(numValue);

    // Синхронизируем локальное состояние с родителем
    setLocalValue(numValue.toString());
  };

  return (
    <div className={twMerge("flex h-10 items-center", className)}>
      <button
        type="button"
        className="flex h-full w-10 items-center justify-center rounded-l-md border border-r-0 border-gray-400 bg-gray-200 text-gray-700 hover:bg-gray-300"
        onClick={handleDecrement}
        aria-label="Уменьшить количество"
      >
        <span className="text-lg font-medium">−</span>
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className="h-full w-14 border-y border-gray-400 bg-white px-2 text-center text-sm font-medium text-gray-900"
        aria-label="Количество"
      />
      <button
        type="button"
        className="flex h-full w-10 items-center justify-center rounded-r-md border border-l-0 border-gray-400 bg-gray-200 text-gray-700 hover:bg-gray-300"
        onClick={handleIncrement}
        aria-label="Увеличить количество"
      >
        <span className="text-lg font-medium">+</span>
      </button>
    </div>
  );
};

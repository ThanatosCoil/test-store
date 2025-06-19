"use client";

import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <Link href="/" className="text-xl font-bold text-blue-600">
              Test Shop
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Тестовое задание React Developer (Next.js)
            </p>
          </div>

          <div className="text-sm text-gray-500">
            &copy; {currentYear} Test Shop. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

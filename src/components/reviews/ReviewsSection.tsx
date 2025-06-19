"use client";

import React, { useState, useEffect } from "react";
import { Review } from "@/types";
import { getReviews } from "@/api";
import { sanitizeHtml } from "@/lib/utils";

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const data = await getReviews();
        setReviews(data);
      } catch (err) {
        setError("Failed to load reviews. Please try again later.");
        console.error("Error loading reviews:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <h2 className="mb-8 text-2xl font-bold inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
          Отзывы наших клиентов
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-lg bg-gray-100 p-6"
            >
              <div className="mb-4 h-6 w-3/4 bg-gray-300"></div>
              <div className="h-32 w-full bg-gray-300"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <h2 className="mb-8 text-2xl font-bold inline-block py-2 bg-blue-100 text-blue-800 rounded-lg">
          Отзывы наших клиентов
        </h2>
        <div className="rounded-lg bg-red-50 p-4 text-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="container mx-auto py-12">
        <h2 className="mb-8 text-2xl font-bold inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
          Отзывы наших клиентов
        </h2>
        <p className="text-center text-gray-500">Пока нет отзывов</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h2 className="mb-8 text-2xl font-bold inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
        Отзывы наших клиентов
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="overflow-hidden rounded-lg bg-gray-50 p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(review.text) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

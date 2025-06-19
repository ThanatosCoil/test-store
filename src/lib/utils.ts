import DOMPurify from "isomorphic-dompurify";

/**
 * Format price to Russian currency format
 */
export const formatCurrency = (price: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Sanitize HTML to prevent XSS attacks
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "span",
      "strong",
      "em",
      "u",
      "ol",
      "ul",
      "li",
      "br",
    ],
  });
};

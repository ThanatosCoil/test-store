import axios from "axios";
import { OrderRequest, OrderResponse, ProductsResponse, Review } from "@/types";

// Используем относительные URL для обращения к нашим API роутам
const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = async (
  page: number = 1,
  pageSize: number = 20
): Promise<ProductsResponse> => {
  try {
    // Используем локальный API роут
    const response = await api.get<ProductsResponse>(
      `/api/products?page=${page}&page_size=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { page, amount: 0, total: 0, items: [] };
  }
};

export const getReviews = async (): Promise<Review[]> => {
  try {
    // Используем локальный API роут
    const response = await api.get<Review[]>("/api/reviews");
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

export const submitOrder = async (
  orderData: OrderRequest
): Promise<OrderResponse> => {
  try {
    // Используем локальный API роут
    const response = await api.post<OrderResponse>("/api/order", orderData);
    return response.data;
  } catch (error) {
    console.error("Error submitting order:", error);
    return {
      success: 0,
      error: "Не удалось отправить заказ. Пожалуйста, попробуйте позже.",
    };
  }
};

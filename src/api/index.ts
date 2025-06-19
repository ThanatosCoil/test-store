import axios from "axios";
import { OrderRequest, OrderResponse, ProductsResponse, Review } from "@/types";

const API_BASE_URL = "http://o-complex.com:1337";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = async (
  page: number = 1,
  pageSize: number = 20
): Promise<ProductsResponse> => {
  try {
    const response = await api.get<ProductsResponse>(
      `/products?page=${page}&page_size=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { page, amount: 0, total: 0, items: [] };
  }
};

export const getReviews = async (): Promise<Review[]> => {
  try {
    const response = await api.get<Review[]>("/reviews");
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
    const response = await api.post<OrderResponse>("/order", orderData);
    return response.data;
  } catch (error) {
    console.error("Error submitting order:", error);
    return { success: 0, error: "Failed to submit order" };
  }
};

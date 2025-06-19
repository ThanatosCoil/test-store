import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL = "http://o-complex.com:1337";

export async function GET(request: NextRequest) {
  try {
    // Получаем параметры запроса
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const page_size = searchParams.get("page_size") || "20";

    // Делаем запрос к внешнему API
    const response = await axios.get(
      `${API_BASE_URL}/products?page=${page}&page_size=${page_size}`,
      { headers: { "Content-Type": "application/json" } }
    );

    // Возвращаем данные клиенту
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error proxying products request:", error);
    return NextResponse.json(
      { page: 1, amount: 0, total: 0, items: [] },
      { status: 500 }
    );
  }
}

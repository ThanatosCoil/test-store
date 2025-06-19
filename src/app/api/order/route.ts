import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL = "http://o-complex.com:1337";

export async function POST(request: NextRequest) {
  try {
    // Получаем данные запроса
    const orderData = await request.json();

    // Делаем запрос к внешнему API
    const response = await axios.post(`${API_BASE_URL}/order`, orderData, {
      headers: { "Content-Type": "application/json" },
    });

    // Возвращаем данные клиенту
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error proxying order request:", error);
    return NextResponse.json(
      {
        success: 0,
        error: "Не удалось отправить заказ. Пожалуйста, попробуйте позже.",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_BASE_URL = "http://o-complex.com:1337";

export async function GET(request: NextRequest) {
  try {
    // Делаем запрос к внешнему API
    const response = await axios.get(`${API_BASE_URL}/reviews`, {
      headers: { "Content-Type": "application/json" },
    });

    // Возвращаем данные клиенту
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error proxying reviews request:", error);
    return NextResponse.json([], { status: 500 });
  }
}

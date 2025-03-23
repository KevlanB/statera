// app/api/auth/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth-token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Não autenticado" },
      { status: 401 },
    );
  }

  // Lógica de autenticação aqui

  return NextResponse.json({ success: true });
}

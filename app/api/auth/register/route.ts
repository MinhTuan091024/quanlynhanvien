import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    //  CHỐNG LỖI JSON RỖNG / SAI
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { username, password } = body;

    //  VALIDATE INPUT
    if (!username || !password) {
      return NextResponse.json(
        { message: "Missing username or password" },
        { status: 400 }
      );
    }

    //  CHECK TRÙNG USERNAME
    const existed = await prisma.users.findUnique({
      where: { username },
    });

    if (existed) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 400 }
      );
    }

    //  HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    //  LƯU USER
    const user = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    //  RESPONSE OK
    return NextResponse.json(
      {
        id: user.id,
        username: user.username,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { message: "Register failed" },
      { status: 500 }
    );
  }
}

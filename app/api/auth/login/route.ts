import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const user = await prisma.users.findUnique({
    where: { username },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid username or password" },
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid username or password" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "Login successful",
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  });
}

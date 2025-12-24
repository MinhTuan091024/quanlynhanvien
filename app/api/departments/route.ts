import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: danh sách phòng ban
export async function GET() {
  const data = await prisma.departments.findMany();
  return NextResponse.json(data);
}

// POST: thêm phòng ban
export async function POST(req: Request) {
  const { name, description } = await req.json();

  const dep = await prisma.departments.create({
    data: { name, description },
  });

  return NextResponse.json(dep, { status: 201 });
}

// PUT: sửa phòng ban
export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const { name, description } = await req.json();

  if (!id) {
    return NextResponse.json({ message: "Missing id" }, { status: 400 });
  }

  const dep = await prisma.departments.update({
    where: { id: Number(id) },
    data: { name, description },
  });

  return NextResponse.json(dep);
}

// DELETE: xóa phòng ban
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Missing id" }, { status: 400 });
  }

  await prisma.departments.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ message: "Deleted successfully" });
}

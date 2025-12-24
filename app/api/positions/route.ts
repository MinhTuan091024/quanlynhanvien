import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: danh sách chức vụ
export async function GET() {
  const data = await prisma.positions.findMany();
  return NextResponse.json(data);
}

// POST: thêm chức vụ
export async function POST(req: Request) {
  const { name, base_salary } = await req.json();

  const pos = await prisma.positions.create({
    data: {
      name,
      base_salary: base_salary ? Number(base_salary) : null,
    },
  });

  return NextResponse.json(pos, { status: 201 });
}

// PUT: sửa chức vụ
export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const { name, base_salary } = await req.json();

  if (!id) {
    return NextResponse.json({ message: "Missing id" }, { status: 400 });
  }

  const pos = await prisma.positions.update({
    where: { id: Number(id) },
    data: {
      name,
      base_salary: base_salary ? Number(base_salary) : null,
    },
  });

  return NextResponse.json(pos);
}

// DELETE: xóa chức vụ
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Missing id" }, { status: 400 });
  }

  await prisma.positions.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ message: "Deleted successfully" });
}

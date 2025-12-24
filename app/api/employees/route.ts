import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/employees
 * Lấy danh sách nhân viên (kèm phòng ban + chức vụ)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const departmentId = searchParams.get("department_id");
  const positionId = searchParams.get("position_id");

  const employees = await prisma.employees.findMany({
    where: {
      department_id: departmentId ? Number(departmentId) : undefined,
      position_id: positionId ? Number(positionId) : undefined,
    },
    include: {
      departments: true,
      positions: true,
    },
  });

  return NextResponse.json(employees);
}

/**
 * POST /api/employees
 * Thêm nhân viên
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      full_name,
      email,
      phone,
      department_id,
      position_id,
      hire_date,
      status,
    } = body;

    // Validate tối thiểu
    if (!full_name || !department_id || !position_id) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const employee = await prisma.employees.create({
      data: {
        full_name,
        email,
        phone,
        department_id: Number(department_id),
        position_id: Number(position_id),
        hire_date: hire_date ? new Date(hire_date) : null,
        status: status ?? "active",
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create employee" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/employees?id=1
 * Cập nhật nhân viên
 */
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Employee id is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const employee = await prisma.employees.update({
      where: { id: Number(id) },
      data: {
        full_name: body.full_name,
        email: body.email,
        phone: body.phone,
        department_id: body.department_id
          ? Number(body.department_id)
          : undefined,
        position_id: body.position_id
          ? Number(body.position_id)
          : undefined,
        hire_date: body.hire_date ? new Date(body.hire_date) : undefined,
        status: body.status,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update employee" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/employees?id=1
 * Xóa nhân viên
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Employee id is required" },
        { status: 400 }
      );
    }

    await prisma.employees.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Employee deleted" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete employee" },
      { status: 500 }
    );
  }
}

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// GET /api/users/singers - Get all singers
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const singers = await prisma.user.findMany({
      where: {
        superuser: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(singers);
  } catch (error) {
    console.error("Error fetching singers:", error);
    return NextResponse.json(
      { error: "Failed to fetch singers" },
      { status: 500 },
    );
  }
}
